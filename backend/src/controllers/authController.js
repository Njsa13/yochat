import bcrypt from "bcrypt";

import prisma from "../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
import { saveAndSendToken } from "../utils/sendEmailVerifUtil.js";
import passport from "../config/passport.js";

export const login = (req, res, next) => {
  passport.authenticate("local", (error, result, info) => {
    if (error) return next(error);
    if (!result) {
      const err = new Error(info.message);
      err.status = info.status;
      return next(err);
    }

    req.login(result, (error) => {
      if (error) {
        console.error("Error in login function: ", error);
        return next(error);
      }
      return res.status(200).json({
        message: "Login successful",
        data: {
          username: result.username,
          email: result.email,
          fullName: result.fullName,
          profilePicture: result.profilePicture,
        },
      });
    });
  })(req, res, next);
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, fullName, password } = req.body;

    const existingUsername = await prisma.user.findUnique({
      select: { userId: true },
      where: { username },
    });
    if (existingUsername) {
      const err = new Error("Username already in use");
      err.status = 409;
      return next(err);
    }

    const existingEmail = await prisma.user.findUnique({
      select: { userId: true },
      where: { email },
    });
    if (existingEmail) {
      const err = new Error("Email already in use");
      err.status = 409;
      return next(err);
    }

    bcrypt.hash(password, 10, async (error, hashedPassword) => {
      if (error) {
        throw error;
      } else {
        const result = await prisma.user.create({
          data: { username, email, fullName, password: hashedPassword },
        });
        await saveAndSendToken(result);
        res.status(201).json({
          message: "New account created successfully",
          data: {
            username: result.username,
            email: result.email,
            fullName: result.fullName,
            profilePicture: result.profilePicture,
          },
        });
      }
    });
  } catch (error) {
    if (error.status === 500)
      console.error("Error in signup function: ", error);
    next(error);
  }
};

export const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await prisma.user.findUnique({
      select: { userId: true, isEmailVerified: true, email: true },
      where: { email },
    });
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    if (user.isEmailVerified) {
      const err = new Error("Email has been verified");
      err.status = 409;
      return next(err);
    }
    await saveAndSendToken(user);
    res.status(200).json({ message: "Verification email successfully sent" });
  } catch (error) {
    if (error.status === 500)
      console.error("Error in sendVerificationEmail function: ", error);
    next(error);
  }
};

export const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.status(200).json({ message: "Logout successful" });
  });
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
    if (!emailVerification) {
      const err = new Error("Token not found");
      err.status = 404;
      return next(err);
    }
    if (emailVerification.expirationDate < new Date()) {
      const err = new Error("Token has expired");
      err.status = 410;
      return next(err);
    }
    if (!emailVerification.user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    if (emailVerification.user.isEmailVerified) {
      const err = new Error("Email has been verified");
      err.status = 409;
      return next(err);
    }

    const result = await prisma.user.update({
      where: { userId: emailVerification.user.userId },
      data: {
        isEmailVerified: true,
      },
    });

    req.login(result, (error) => {
      if (error) {
        if (error) throw error;
      }
      return res.status(200).json({
        message: "Email successfully verified",
        data: {
          username: result.username,
          email: result.email,
          fullName: result.fullName,
          profilePicture: result.profilePicture,
        },
      });
    });
  } catch (error) {
    console.error("Error in verifyEmail function: ", error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, fullName } = req.body;
    const { userId } = req.user;

    const existingUsername = await prisma.user.findUnique({
      select: { userId: true },
      where: { username },
    });
    if (existingUsername && existingUsername.userId !== userId) {
      const err = new Error("Username already in use");
      err.status = 409;
      next(err);
    }

    const result = await prisma.user.update({
      where: { userId },
      data: {
        username,
        fullName,
      },
    });

    res.status(200).json({
      message: "User profile successfully updated",
      data: {
        username: result.username,
        fullName: result.fullName,
      },
    });
  } catch (error) {
    console.error("Error in updateUser function: ", error);
    next(error);
  }
};

export const updateProfilePic = async (req, res, next) => {
  try {
    const { profilePicture } = req.body;
    const { userId } = req.user;

    let newProfilePic = "";

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      newProfilePic = uploadResponse.secure_url;
    }

    const result = await prisma.user.update({
      where: { userId },
      data: {
        profilePicture: newProfilePic,
      },
    });

    res.status(200).json({
      message: "Profile picture successfully updated",
      data: {
        profilePicture: result.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in updateProfilePic function: ", error);
    next(error);
  }
};

export const checkAuth = (req, res, next) => {
  const { user } = req;
  res.status(200).json({
    data: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    },
  });
};

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", (error, result, info) => {
    if (error || !result) {
      let errorParam = null;
      if (error) {
        errorParam = encodeURIComponent(
          JSON.stringify({
            status: error.status || 500,
            message: (error.status && error.message) || "Internal Server Error",
          })
        );
      }
      if (info) {
        errorParam = encodeURIComponent(JSON.stringify(info));
      }
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=${errorParam}`
      );
    }

    req.login(result, (error) => {
      if (error) {
        console.error("Error in login with google function: ", error);
        const errorParam = encodeURIComponent(
          JSON.stringify({
            status: error.status || 500,
            message: (error.status && error.message) || "Internal Server Error",
          })
        );
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=${errorParam}`
        );
      }
      return res.redirect(process.env.CLIENT_URL);
    });
  })(req, res, next);
};
