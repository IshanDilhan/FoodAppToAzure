import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/adminmodel.js";
import Restaurant from "../models/restaurantmodel.js";
import nodemailer from "nodemailer";


export const registerAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: "Admin already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new admin
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
      });
  
      await newAdmin.save();
  
      res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin: {
          id: newAdmin._id,
          email: newAdmin.email,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Admin registration failed" });
    }
  };

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Admin login failed" });
  }
};

// Approve Restaurant
export const approveRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved: true },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"FoodDelivery Team" <${process.env.EMAIL_USER}>`,
      to: restaurant.email,
      subject: "Restaurant Registration Approved",
      html: `
        <h3>Hi ${restaurant.name},</h3>
        <p>Your restaurant registration has been approved by our team!</p>
        <p>You can now log in to your account and start managing your menu and orders.</p>
        <p><strong>Commission Details:</strong> 10% on each order (or customize as needed).</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br/>
        <p>Best regards,</p>
        <p>FoodDelivery Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Restaurant approved and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
};
