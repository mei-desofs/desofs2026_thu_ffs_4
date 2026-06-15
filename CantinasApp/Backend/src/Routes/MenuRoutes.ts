import { Router } from "express";
import { MenuController } from "../Controller/MenuController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Nutritionist", "NetworkManager"), MenuController.createMenu);
router.get("/week/current", apiLimiter, authMiddleware, MenuController.getCurrentWeekMenu);
router.get("/", apiLimiter, authMiddleware, MenuController.listMenus);
router.get("/:id", apiLimiter, authMiddleware, MenuController.getMenu);
router.put("/:id", apiLimiter, authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), MenuController.updateMenuStatus);
router.get("/canteen/:canteenId", apiLimiter, authMiddleware, MenuController.getMenusByCanteen);

export default router;
