import express from "express";
import multer from "multer";
import { register, login, getProfile, updateProfile,getAllUsers,deleteUserById } from "../controllers/authController.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();


router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.get("/profile", authUser, getProfile);
router.put("/profile", authUser, upload.single("profilePic"), updateProfile);
router.get("/all", getAllUsers);
router.delete("/user/:userId", deleteUserById);

export default router;
