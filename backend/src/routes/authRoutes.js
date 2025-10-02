import e from "express";

import passport from "../config/passport.js";

import {
  checkAuth,
  googleCallback,
  login,
  logout,
  sendVerificationEmail,
  signup,
  updateProfile,
  updateProfilePic,
  verifyEmail,
} from "../controllers/authController.js";
import {
  loginValidator,
  sendVerificationEmailValidator,
  signupValidator,
  updateProfilePicValidator,
  updateProfileValidator,
  verifyEmailValidator,
} from "../validators/userValidator.js";
import validate from "../middlewares/validate.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = e.Router();

router.post("/login", loginValidator, validate, login);
router.post("/signup", signupValidator, validate, signup);
router.post(
  "/send-verification-email",
  sendVerificationEmailValidator,
  validate,
  sendVerificationEmail
);
router.get("/logout", logout);
router.put("/verify-email", verifyEmailValidator, validate, verifyEmail);
router.put(
  "/update-profile",
  isAuthenticated,
  updateProfileValidator,
  validate,
  updateProfile
);
router.put(
  "/update-profile-pic",
  isAuthenticated,
  updateProfilePicValidator,
  validate,
  updateProfilePic
);
router.get("/check-auth", isAuthenticated, checkAuth);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", googleCallback);

export default router;
