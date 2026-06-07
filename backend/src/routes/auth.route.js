import express from "express";
import { signup, login, logout,onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middileware/auth.middileware.js";

console.log("Auth routes loaded");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.patch("/onboarding",protectRoute, onboard);
//check if user logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;