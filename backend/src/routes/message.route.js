import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user/:id", protectRoute, getMessages);
router.post("/send/user/:id", protectRoute, sendMessage);

export default router;
