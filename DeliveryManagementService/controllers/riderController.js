// controllers/rider.controller.js
import Rider from "../models/Rider.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//import { v2 as cloudinary } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import Joi from "joi";
//import upload from "../middleware/multer.js"; // Your Multer config


export const registerRider = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Check if rider already exists
    const existing = await Rider.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered. Please login." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new rider
    const rider = new Rider({
      email,
      password: hashedPassword
    });

    await rider.save();

    // Generate JWT
    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      rider: {
        id: rider._id,
        email: rider.email
        
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found." });
    }

    const validPassword = await bcrypt.compare(password, rider.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const accessToken = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    rider.refreshToken = refreshToken;
    await rider.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      rider: {
        id: rider._id,
        email: rider.email,
       status: rider.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed.", error: err.message });
  }
};
 



// Update Rider Location (for profile update or real-time location update)


export const addLocation = async (req, res) => {
  try {
    const riderId = req.user.id; // Rider ID from authUser middleware
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found." });
    }

    rider.location = location;
    await rider.save();

    res.status(201).json({
      success: true,
      message: "Location added successfully.",
      rider: {
        id: rider._id,
        location: rider.location,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add location.", error: err.message });
  }
};





// Define Joi validation schema for vehicleInfo
const vehicleInfoSchema = Joi.object({
  brand: Joi.string()
    .pattern(/^[A-Za-z0-9\- ]{2,30}$/)
    .required()
    .messages({
      'string.pattern.base': 'Brand must be 2-30 characters, letters, numbers, spaces, or hyphens only.',
      'string.empty': 'Brand is required.'
    }),
  model: Joi.string()
    .pattern(/^[A-Za-z0-9\- ]{2,30}$/)
    .required()
    .messages({
      'string.pattern.base': 'Model must be 2-30 characters, alphanumeric, spaces, or hyphens only.',
      'string.empty': 'Model is required.'
    }),
  color: Joi.string()
    .pattern(/^[A-Za-z ]{3,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Color must be 3-20 alphabetic characters and spaces only.'
    }),
  licensePlateNumber: Joi.string()
    .pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'License plate number format invalid (e.g., MH12AB1234).',
      'string.empty': 'License plate number is required.'
    }),
  drivingLicenseNumber: Joi.string()
    .pattern(/^[A-Z]{2}[0-9]{2}\/[0-9]{4,10}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Driving license number format invalid (e.g., MH12/2023456).'
    }),
  insuranceNumber: Joi.string()
    .pattern(/^[A-Za-z0-9\-]{8,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Insurance number must be 8-20 alphanumeric or hyphen characters.'
    }),
  documentImageUrl: Joi.string()
    .pattern(/^https?:\/\/[^\s]+\.(jpg|jpeg|png|pdf)$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Document image URL must be a valid image or PDF URL.'
    }),
});

export const selectVehicleType = async (req, res) => {
  try {
    const riderId = req.user.id;
    const { vehicleType } = req.body;

    // Validate vehicleType
    if (!vehicleType || !['MOTORCYCLE', 'BICYCLE'].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type. Choose MOTORCYCLE or BICYCLE.'
      });
    }

    // Parse vehicleInfo from JSON string (from multipart form)
    let vehicleInfo = {};
    if (req.body.vehicleInfo) {
      try {
        vehicleInfo = JSON.parse(req.body.vehicleInfo);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid vehicleInfo format. Must be valid JSON.' });
      }
    }

    // If MOTORCYCLE, validate all fields and handle file upload
    if (vehicleType === 'MOTORCYCLE') {
      // Validate required fields
      const { error } = vehicleInfoSchema.validate(vehicleInfo, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map(d => d.message).join(' ')
        });
      }

      // File validation
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle document image required for motorcycles.'
        });
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.'
        });
      }
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum 5MB allowed.'
        });
      }

      // Upload to Cloudinary
      let uploadResult;
      try {
        uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'riders/vehicle-documents',
          resource_type: 'auto'
        });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Document upload failed.',
          error: uploadError.message
        });
      }
      vehicleInfo.documentImageUrl = uploadResult.secure_url;
    }

    // If BICYCLE, clear vehicleInfo
    if (vehicleType === 'BICYCLE') {
      vehicleInfo = undefined;
    }

    // Update rider document
    const rider = await Rider.findByIdAndUpdate(
      riderId,
      {
        vehicleType,
        vehicleInfo: vehicleType === 'MOTORCYCLE' ? vehicleInfo : undefined
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: 'Rider not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Vehicle information ${vehicleType === 'MOTORCYCLE' ? 'and document' : ''} saved successfully.`,
      data: rider
    });

  } catch (err) {
    console.error('Vehicle update error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle information.',
      error: err.message
    });
  }
};


// Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const riderId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'riders/profile-pictures',
      resource_type: 'image',
    });

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found." });
    }

    rider.profilePictureUrl = result.secure_url;
    await rider.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      rider: {
        id: rider._id,
        profilePictureUrl: rider.profilePictureUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload profile picture.", error: err.message });
  }
};

// controllers/rider.controller.js (add this)

export const selectWorkType = async (req, res) => {
  try {
    const riderId = req.user.id; // Get rider ID from authUser middleware
    const { workType, availableTimeSlots } = req.body;

    if (!workType || !['FULL_TIME', 'PART_TIME'].includes(workType)) {
      return res.status(400).json({ success: false, message: 'Invalid work type. Please select FULL_TIME or PART_TIME.' });
    }

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found.' });
    }

    rider.workType = workType;

    if (workType === 'FULL_TIME') {
      // FULL_TIME riders are available 24/7
      rider.availableTimeSlots = ["00:00-23:59"];
    } else if (workType === 'PART_TIME') {
      if (!availableTimeSlots || !Array.isArray(availableTimeSlots) || availableTimeSlots.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide at least one available time slot for PART_TIME.' });
      }
      rider.availableTimeSlots = availableTimeSlots;
    }

    await rider.save();

    res.status(200).json({
      success: true,
      message: `Work type updated to ${workType}.`,
      rider: {
        id: rider._id,
        workType: rider.workType,
        availableTimeSlots: rider.availableTimeSlots,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update work type.', error: err.message });
  }
};

export const addPersonalInfo = async (req, res) => {
  try {
    const riderId = req.user.id; // get rider id from auth middleware
    const { name, age, address, phoneNumber, nationalIdNumber, emergencyContact } = req.body;

    // Basic validations
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Valid name is required (minimum 2 characters)." });
    }
    if (!age || typeof age !== 'number' || age < 15 || age > 60) {
      return res.status(400).json({ success: false, message: "Valid age is required (between 15 and 60)." });
    }
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Valid address is required (minimum 5 characters)." });
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Valid 10-digit phone number is required." });
    }

    // NIC validation (optional field)
    if (nationalIdNumber) {
      const nicRegexNew = /^\d{12}$/; // 12 digits
      const nicRegexOld = /^\d{9}[vV]$/; // 9 digits + 'v' or 'V'
      if (!nicRegexNew.test(nationalIdNumber) && !nicRegexOld.test(nationalIdNumber)) {
        return res.status(400).json({ success: false, message: "Invalid NIC format. Must be 12 digits or 9 digits followed by 'V'." });
      }
    }

    // Emergency contact validation
    if (!emergencyContact || !emergencyContact.name || !emergencyContact.phoneNumber) {
      return res.status(400).json({ success: false, message: "Emergency contact name and phone number are required." });
    }
    if (!/^\d{10}$/.test(emergencyContact.phoneNumber)) {
      return res.status(400).json({ success: false, message: "Valid 10-digit emergency contact number is required." });
    }

    // Fetch rider
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found." });
    }

    // Check vehicle type and apply extra age validation
    if (rider.vehicleType === 'MOTORCYCLE' && age < 18) {
      return res.status(400).json({ success: false, message: "Must be at least 18 years old to register with a MOTORCYCLE." });
    }
    if (rider.vehicleType === 'BICYCLE' && age < 21) {
      return res.status(400).json({ success: false, message: "Must be at least 21 years old to register with a BICYCLE." });
    }

    // Update rider personal info
    rider.personalInfo = {
      name,
      age,
      address,
      phoneNumber,
      nationalIdNumber,
      emergencyContact
    };

    // Set status to PENDING when personal info is added
    rider.status = 'PROCESSING';

    await rider.save();

    res.status(200).json({
      success: true,
      message: "Personal information added successfully.",
      rider: {
        id: rider._id,
        personalInfo: rider.personalInfo
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add personal information.", error: err.message });
  }
};




export const getCurrentRiderProfile = async (req, res) => {
  try {
    const riderId = req.user.id;
    const rider = await Rider.findById(riderId)
      .select('-password -__v') // Exclude sensitive and technical fields
      .lean();

    if (!rider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Rider account not found' 
      });
    }

    // Structure response for clarity
    const formattedResponse = {
      success: true,
      message: 'Rider profile retrieved successfully',
      rider: {
        id: rider._id,
        email: rider.email,
        status: rider.status,
        profile: {
          name: rider.personalInfo?.name || 'Not provided',
          phone: rider.personalInfo?.phone || 'Not provided',
          address: rider.personalInfo?.address || 'Not provided',
          profilePicture: rider.profilePictureUrl || null,
        },
        vehicle: {
          type: rider.vehicleType || 'Not specified',
          details: rider.vehicleInfo || {},
        },
        availability: {
          timeSlots: rider.availableTimeSlots || [],
          workType: rider.workType || 'Not specified',
        },
        registrationDate: rider.createdAt.toISOString().split('T')[0], // YYYY-MM-DD format
      }
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getNearbyRidersByAddress = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }
    // Extract city/area (e.g., last part after comma)
    const area = address.split(',').pop().trim();

    const riders = await Rider.find({
      status: "APPROVED",
      "personalInfo.address": { $regex: new RegExp(area, "i") }
    }).select("profilePictureUrl personalInfo location _id");

    res.json({ success: true, riders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch nearby riders", error: err.message });
  }
};


