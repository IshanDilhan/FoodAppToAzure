import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) { // You must set isAdmin: true for admins when creating their tokens
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};
