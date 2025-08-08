import e from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getContacts, getMessages, sendMessage } from "../controllers/messageController.js";
import { getMessagesValidator, getSingleContactValidator, sendMessageValidator } from "../validators/messageValidator.js";
import validate from "../middlewares/validate.js";

const router = e.Router();

router.get("/contacts", isAuthenticated, getContacts);
router.get("/contact/:email", isAuthenticated, getSingleContactValidator);
router.get("/:chatRoomId", isAuthenticated, getMessagesValidator, validate, getMessages);
router.post("/send/:email", isAuthenticated, sendMessageValidator, validate, sendMessage);

export default router;
