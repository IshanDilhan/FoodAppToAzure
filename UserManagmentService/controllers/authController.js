import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    let profilePicUrl = "";

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password required" });

    const emailLower = email.toLowerCase();

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
      });
      profilePicUrl = result.secure_url;
    }

    const existing = await User.findOne({ email: emailLower });
    if (existing)
      return res.status(400).json({ message: "Email already registered. Please login." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: emailLower,
      password: hashed,
      profilePic: profilePicUrl,
      address: address || "",
      phone: phone || ""
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, address, phone } = req.body;
    let updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (address !== undefined) updateFields.address = address;
    if (phone !== undefined) updateFields.phone = phone;
    if (req.body.password) {
      updateFields.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
      });
      updateFields.profilePic = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Public: Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user account using deleteOne()
    await User.deleteOne({ _id: userId });
    
    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};