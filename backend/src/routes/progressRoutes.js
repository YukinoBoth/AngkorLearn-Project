import express from "express";
import { getProgress, updateProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getProgress));
router.put("/", protect, asyncHandler(updateProgress));

export default router;
