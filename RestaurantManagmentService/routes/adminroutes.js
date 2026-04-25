import express from "express";
import {registerAdmin, loginAdmin, approveRestaurant } from "../controllers/admincontroller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.put("/approve/:restaurantId", adminAuth, approveRestaurant); // protected route
router.post("/register", registerAdmin);

export default router;
