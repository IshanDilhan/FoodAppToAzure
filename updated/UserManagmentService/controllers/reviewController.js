import axios from "axios";
import Review from "../models/review.js";

export const addOrUpdateReview = async (req, res) => {
  try {
    const { menuId, rating, comment } = req.body;
    const userId = req.userId;

    // Validation
    if (!menuId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Menu ID and rating are required",
      });
    }

    // ✅ Check menu existence via Restaurant Management Service API
    const restaurantServiceURL = process.env.RESTAURANT_SERVICE_URL || "http://localhost:4000"; // Update to match your actual service
    let menuExists;

    try {
      const menuResponse = await axios.get(`${restaurantServiceURL}/api/menu/${menuId}`);
      menuExists = menuResponse.data?.success;
    } catch (apiErr) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found in Restaurant Service",
        error: apiErr.response?.data?.message || apiErr.message,
      });
    }

    if (!menuExists) {
      return res.status(404).json({
        success: false,
        message: "Menu item does not exist",
      });
    }

    // ✅ Create or update review
    const review = await Review.findOneAndUpdate(
      { user: userId, menu: menuId },
      { rating, comment },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: review,
    });

  } catch (error) {
    console.error("Review error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message.startsWith("E11000")
        ? "You've already reviewed this menu"
        : "Failed to save review",
      error: error.message,
    });
  }
};

export const getMenuReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ menu: req.params.menuId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};
