import express from "express";
import { addOrUpdateReview, getMenuReviews } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

// Add/Update review (Protected)
router.post("/", authUser, addOrUpdateReview);

// Get reviews for a menu (Public)
router.get("/:menuId", getMenuReviews);

export default router;
