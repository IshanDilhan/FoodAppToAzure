import express from "express";
import {
  createMenu,
  getRestaurantMenus,
  getMenusByCategory,
  updateMenu,
  deleteMenu,
  getPopularMenus,
  getAllPopularMenus,
  getMenuById,
  getRestaurantByMenuId,
  getMenuWithRestaurant
} from "../controllers/menucontroller.js";
import restaurantAuth from "../middleware/restaurantAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/popular", getAllPopularMenus);
router.get("/:restaurantId", getRestaurantMenus);
router.get("/:restaurantId/popular", getPopularMenus);
router.get("/:restaurantId/category/:category", getMenusByCategory);

router.post("/", restaurantAuth, upload.single("image"), createMenu);
router.put("/:menuId", restaurantAuth, upload.single("image"), updateMenu);

// FIX: RESTful delete route
router.delete("/:menuId", restaurantAuth, deleteMenu);



router.get("/:menuId/with-restaurant", getMenuWithRestaurant);
router.get('/:id', getMenuById);
router.get("/:menuId/restaurant", getRestaurantByMenuId);

export default router;
