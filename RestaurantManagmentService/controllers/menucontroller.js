import Menu from "../models/menumodel.js";
import Restaurant from "../models/restaurantmodel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";


export const createMenu = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, sides, popular } = req.body;
    const restaurantId = req.restaurantId; 

    let imageUrl = "";
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadRes.secure_url;
    }

    const menu = new Menu({
      restaurant: restaurantId,
      name,
      description,
      price,
      image: imageUrl,
      category,
      subcategory,
      sides: sides ? JSON.parse(sides) : [],
      popular: popular === "true" || popular === true, 
    });

    await menu.save();
    res.status(201).json({ success: true, data: menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add menu item." });
  }
};


export const getRestaurantMenus = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const menus = await Menu.find({ restaurant: restaurantId });
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch menu items." });
  }
};


export const getPopularMenus = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const menus = await Menu.find({ restaurant: restaurantId, popular: true });
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch popular menus." });
  }
};


export const getMenusByCategory = async (req, res) => {
  try {
    const { restaurantId, category } = req.params;
    const menus = await Menu.find({ restaurant: restaurantId, category });
    
    const grouped = {};
    menus.forEach((item) => {
      if (!grouped[item.subcategory]) grouped[item.subcategory] = [];
      grouped[item.subcategory].push(item);
    });
    res.status(200).json({ success: true, data: grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch menu items." });
  }
};


export const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.menuId;
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ success: false, message: "Menu item not found." });
    // 
    if (menu.restaurant.toString() !== req.restaurantId)
      return res.status(403).json({ success: false, message: "Unauthorized." });

    const { name, description, price, category, subcategory, sides, popular } = req.body;

    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = price;
    if (category) menu.category = category;
    if (subcategory) menu.subcategory = subcategory;
    if (sides) menu.sides = JSON.parse(sides);
    if (typeof popular !== "undefined") menu.popular = popular === "true" || popular === true;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path);
      menu.image = uploadRes.secure_url;
    }

    await menu.save();
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update menu item." });
  }
};


export const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.menuId;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }
    if (menu.restaurant.toString() !== req.restaurantId) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }
    // FIX: Use Model.deleteOne or findByIdAndDelete
    await Menu.deleteOne({ _id: menuId });
    // Or: await Menu.findByIdAndDelete(menuId);
    res.status(200).json({ success: true, message: "Menu item deleted." });
  } catch (err) {
    console.error("Delete menu error:", err);
    res.status(500).json({ success: false, message: "Failed to delete menu item." });
  }
};




export const getAllPopularMenus = async (req, res) => {
  try {
    // Optionally populate restaurant name
    const menus = await Menu.find({ popular: true }).populate("restaurant", "name");
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch all popular menus." });
  }
};


export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate({
        path: 'restaurant',
        select: '_id name',
        model: 'Restaurant' 
      })
      .lean();

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: null
      });
    }

    
    if (!menu.restaurant) {
      return res.status(404).json({
        success: false,
        message: "Associated restaurant not found",
        data: null
      });
    }

    // Force consistent ID format
    const responseData = {
      ...menu,
      restaurant: {
        _id: menu.restaurant._id.toString(),
        name: menu.restaurant.name
      }
    };

    res.json({ 
      success: true, 
      data: responseData 
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};


export const getRestaurantByMenuId = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId).lean();
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    if (!menu.restaurant) {
      return res.status(404).json({ success: false, message: "Menu does not have a restaurant reference" });
    }
    if (!mongoose.Types.ObjectId.isValid(menu.restaurant)) {
      return res.status(400).json({ success: false, message: "Invalid restaurant ID in menu" });
    }
    const restaurant = await Restaurant.findById(menu.restaurant).lean();
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.json({
      success: true,
      data: {
        _id: restaurant._id,
        name: restaurant.name,
        logo: restaurant.logo,
        address: restaurant.address
      }
    });
  } catch (error) {
    console.error("Error in getRestaurantByMenuId:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getMenuWithRestaurant = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId)
      .populate({
        path: "restaurant",
        select: "_id name logo address email contactNumber coverImage availableTime",
        model: "Restaurant"
      })
      .lean();

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    if (!menu.restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this menu" });
    }

    res.json({
      success: true,
      data: {
        ...menu,
        restaurant: {
          _id: menu.restaurant._id,
          name: menu.restaurant.name,
          logo: menu.restaurant.logo,
          address: menu.restaurant.address,
          email: menu.restaurant.email,
          contactNumber: menu.restaurant.contactNumber,
          coverImage: menu.restaurant.coverImage,
          availableTime: menu.restaurant.availableTime
        }
      }
    });
  } catch (error) {
    console.error("Error in getMenuWithRestaurant:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};