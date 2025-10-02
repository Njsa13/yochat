import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

import prisma from "../prisma/client.js";
import { saveAndSendToken } from "../utils/sendEmailVerifUtil.js";

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await prisma.user.findUnique({
        where: { email: username },
      });
      if (result) {
        if (!result.isEmailVerified) {
          await saveAndSendToken(result);
          return cb(null, false, {
            status: 403,
            message: "Email not verified",
          });
        }
        bcrypt.compare(password, result.password, (error, valid) => {
          if (error) {
            throw error;
          } else {
            if (valid) {
              return cb(null, result);
            } else {
              return cb(null, false, {
                status: 401,
                message: "Invalid credentials",
              });
            }
          }
        });
      } else {
        return cb(null, false, { status: 401, message: "Invalid credentials" });
      }
    } catch (error) {
      if (error.status < 500)
        return cb(null, false, {
          status: error.status,
          message: error.message,
        });
      console.error("Error in local strategy: ", error);
      cb(error);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.VITE_API_URL + "/api/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value || profile._json?.email;
        if (!email) {
          return cb(null, false, {
            status: 404,
            message: "Google account does not provide email",
          });
        }
        const result = await prisma.user.findUnique({
          where: { email },
        });
        if (result) {
          if (result.loginStrategy !== "GOOGLE") {
            return cb(null, false, {
              status: 409,
              message: "Email is already registered using another method",
            });
          }
          return cb(null, result);
        }
        const newUser = await prisma.user.create({
          data: {
            username: email.split("@")[0],
            email,
            fullName:
              profile.displayName ||
              `${profile.name?.givenName || ""} ${
                profile.name?.familyName || ""
              }`.trim(),
            password: null,
            loginStrategy: "GOOGLE",
            profilePicture:
              profile.photos?.[0]?.value || profile._json?.picture,
            isEmailVerified: true,
          },
        });
        return cb(null, newUser);
      } catch (error) {
        console.error("Error in google strategy: ", error);
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.userId);
});

passport.deserializeUser(async (userId, cb) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    if (!user) return cb(null, false);
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});

export default passport;
