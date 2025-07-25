import e from "express";

import { testAuth } from "../controllers/auth-controller.js";

const router = e.Router();

router.get("/test", testAuth);

export default router;