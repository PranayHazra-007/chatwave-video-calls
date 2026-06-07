import express from "express";
import { protectRoute } from "../middileware/auth.middileware.js";
import {getStreamToken} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token",protectRoute, getStreamToken);

export default router;