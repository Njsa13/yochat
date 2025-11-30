import e from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getContacts,
  getMessages,
  getSingleContact,
  readMessage,
  sendMessage,
} from "../controllers/messageController.js";
import {
  chatRoomIdValidator,
  getSingleContactValidator,
  sendMessageValidator,
} from "../validators/messageValidator.js";
import validate from "../middlewares/validate.js";

const router = e.Router();

router.get("/contacts", isAuthenticated, getContacts);
router.get(
  "/contact/:email",
  isAuthenticated,
  getSingleContactValidator,
  validate,
  getSingleContact
);
router.get(
  "/:chatRoomId",
  isAuthenticated,
  chatRoomIdValidator,
  validate,
  getMessages
);
router.post(
  "/send/:email",
  isAuthenticated,
  sendMessageValidator,
  validate,
  sendMessage
);
router.put(
  "/read/:chatRoomId",
  isAuthenticated,
  chatRoomIdValidator,
  validate,
  readMessage
);

export default router;
