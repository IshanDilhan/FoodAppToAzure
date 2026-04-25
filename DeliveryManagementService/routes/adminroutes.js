import express from 'express';
import { getAllRiders, updateRiderStatus } from '../controllers/adminRiderController.js'; // adjust path
import { authAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Route: GET /api/admin/riders
router.get('/riders', getAllRiders);
router.put('/update-status',  updateRiderStatus);
export default router;
