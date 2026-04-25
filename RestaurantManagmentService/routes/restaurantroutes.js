import express from "express";
import {registerRestaurant,loginRestaurant,getAllRestaurants,getApprovedRestaurants,approveRestaurant,getRestaurantById} from "../controllers/restaurantcontroller.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/register",upload.fields([{ name: "logo", maxCount: 1 },{ name: "coverImage", maxCount: 1 },]),registerRestaurant);


router.post("/login", loginRestaurant);


router.get("/all", getAllRestaurants);


router.get("/approved", getApprovedRestaurants);

router.get("/all", getAllRestaurants); 
router.get("/approved", getApprovedRestaurants);    
router.put("/approve/:id",adminAuth, approveRestaurant); 
router.get("/:id", getRestaurantById);

export default router;