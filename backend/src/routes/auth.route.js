import express from "express";
import { checkAuth, login, logout, signup, updateProfile, getUsersForSidebar } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);

router.get("/users", protectRoute, getUsersForSidebar);

export default router;
