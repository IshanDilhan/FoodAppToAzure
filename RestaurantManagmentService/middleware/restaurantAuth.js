import jwt from "jsonwebtoken";
import Restaurant from "../models/restaurantmodel.js";

const restaurantAuth = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }
    const token = authHeader.split(" ")[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    const restaurant = await Restaurant.findById(decoded.id);
    if (!restaurant || !restaurant.isApproved) {
      return res.status(401).json({ success: false, message: "Unauthorized restaurant." });
    }

   
    req.restaurantId = restaurant._id.toString();
    req.restaurant = restaurant;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default restaurantAuth;
