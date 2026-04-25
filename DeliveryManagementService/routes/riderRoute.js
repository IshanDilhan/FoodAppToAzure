// routes/riderRoute.js (updated)
import express from "express";
import { 
  registerRider,
  loginRider,
  addLocation,
  selectVehicleType,
  uploadProfilePicture,
  selectWorkType,
  addPersonalInfo,
  getCurrentRiderProfile,
  getNearbyRidersByAddress ,
 
} from "../controllers/riderController.js";
import { authRider } from '../middleware/authRider.js';

import upload from "../middleware/multer.js";

const router = express.Router();

// Enhanced Multer configuration
const vehicleDocumentUpload = upload.single('documentImage');

// Vehicle type route with improved error handling
router.post(
  "/select-vehicle-type",
  authRider,
  (req, res, next) => {
    vehicleDocumentUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
          code: err.code || 'UPLOAD_ERROR'
        });
      }
      next();
    });
  },
  selectVehicleType
);

// Other routes remain similar but should follow same pattern
router.post("/register", registerRider);
router.post("/login", loginRider);
router.post("/location", authRider, addLocation);
router.post("/upload-profile-picture", authRider, upload.single('profilePicture'), uploadProfilePicture);
router.post("/select-work-type", authRider, selectWorkType);
router.post("/add-personal-info", authRider, addPersonalInfo);
router.get('/me', authRider, getCurrentRiderProfile);
router.get('/nearby-riders', getNearbyRidersByAddress);



export default router;
