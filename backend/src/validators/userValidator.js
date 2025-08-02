import { body, query } from "express-validator";

export const signupValidator = [
  body("username").isString().withMessage("Username must be string").notEmpty().withMessage("Username required"),
  body("email").isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email required"),
  body("fullName").isString().withMessage("Full name must be string").notEmpty().withMessage("Full name required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").notEmpty().withMessage("Password required"),
];

export const loginValidator = [
  body("username").isString().withMessage("Username must be string").notEmpty().withMessage("Username required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").notEmpty().withMessage("Password required"),
];

export const sendVerificationEmailValidator = [query("username").notEmpty().withMessage("Username required")];

export const verifyEmailValidator = [query("token").notEmpty().withMessage("Token required")];

export const updateProfileValidator = [
  body("username").isString().withMessage("Username must be string").notEmpty().withMessage("Username required"),
  body("fullName").isString().withMessage("Full name must be string").notEmpty().withMessage("Full name required"),
];
export const updateProfilePicValidator = [
  body("profilePicture").custom((value) => {
    if (value === "") return true;
    const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
    if (!base64Pattern.test(value)) {
      throw new Error("Image must be base64 string with proper mime type (jpeg/png)");
    }
    return true;
  }),
];
