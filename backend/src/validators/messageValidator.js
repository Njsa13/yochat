import { body, param } from "express-validator";

export const chatRoomIdValidator = [
  param("chatRoomId").notEmpty().withMessage("Chat Room Id required"),
];

export const getSingleContactValidator = [
  param("email").notEmpty().withMessage("Email required"),
];

export const sendMessageValidator = [
  body("text").optional().isString().withMessage("Text must be string"),
  body("image")
    .optional()
    .matches(/^data:image\/(png|jpeg|jpg);base64,/)
    .withMessage(
      "Image must be base64 string with proper mime type (jpeg/png)"
    ),
  param("email").notEmpty().withMessage("Email required"),
];
