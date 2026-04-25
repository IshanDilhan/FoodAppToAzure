import jwt from 'jsonwebtoken';

export const authRider = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Debug: log the decoded token
    console.log("Decoded token:", decoded);
    req.user = { id: decoded.id };  // Attach rider's ID to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Invalid Token. Login Again.' });
  }
};
