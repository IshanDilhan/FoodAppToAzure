import express from "express";
import { getAllReviews, deleteReview } from "../controllers/allReview.js";


const router = express.Router();

router.get("/", getAllReviews);               // Public: anyone can view all reviews
router.delete("/:id", deleteReview); 

export default router;
