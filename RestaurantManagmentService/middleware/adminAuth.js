import jwt from "jsonwebtoken";
import Admin from "../models/adminmodel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized: Admin not found" });
    }

    req.admin = admin; // Attach admin info to request object
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
