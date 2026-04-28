import Restaurant from "../models/restaurantmodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// REGISTER
export const registerRestaurant = async (req, res) => {
  try {
    const { name, email, contactNumber, address, availableTime, password, logo, coverImage } = req.body;

    const existing = await Restaurant.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl = logo || "";
    let coverImageUrl = coverImage || "";

    // If files are uploaded via form-data, use Cloudinary
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const logoUpload = await cloudinary.uploader.upload(req.files.logo[0].path);
        logoUrl = logoUpload.secure_url;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverUpload = await cloudinary.uploader.upload(req.files.coverImage[0].path);
        coverImageUrl = coverUpload.secure_url;
      }
    }

    const newRestaurant = new Restaurant({
      name,
      email,
      contactNumber,
      address,
      availableTime,
      password: hashedPassword,
      logo: logoUrl,
      coverImage: coverImageUrl,
    });

    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: "Registered successfully. Await admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed.", error: err.message });
  }
};

// LOGIN
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({ success: false, message: "Restaurant not approved yet." });
    }

    const validPassword = await bcrypt.compare(password, restaurant.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        logo: restaurant.logo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

// GET ALL RESTAURANTS
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch restaurants." });
  }
};

// GET APPROVED RESTAURANTS (optional public endpoint)
export const getApprovedRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isApproved: true });
    res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch approved restaurants." });
  }
};

// APPROVE A RESTAURANT (ADMIN ONLY)
export const approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }

    restaurant.isApproved = true;
    await restaurant.save();

    // Optionally: send email to the restaurant owner with login instructions

    res.status(200).json({ success: true, message: "Restaurant approved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to approve restaurant." });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch restaurant." });
  }
};