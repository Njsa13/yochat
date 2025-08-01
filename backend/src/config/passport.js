import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

import prisma from "../prisma/client.js";

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await prisma.user.findUnique({
        where: { username },
      });
      if (result) {
        if (!result.isEmailVerified) return cb(null, false, { status: 403, message: "Email not verified" });
        bcrypt.compare(password, result.password, (error, valid) => {
          if (error) {
            throw error;
          } else {
            if (valid) {
              return cb(null, result);
            } else {
              return cb(null, false, { status: 401, message: "Invalid credentials" });
            }
          }
        });
      } else {
        return cb(null, false, { status: 401, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error in local strategy: ", error);
      cb(error);
    }
  })
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
