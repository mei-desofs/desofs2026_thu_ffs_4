import { Router } from "express";
import { MenuController } from "../Controller/MenuController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Nutritionist", "NetworkManager"), MenuController.createMenu);
router.get("/week/current", apiLimiter, authMiddleware, MenuController.getCurrentWeekMenu);
router.get("/", authMiddleware, MenuController.listMenus);
router.get("/:id", authMiddleware, MenuController.getMenu);
router.put("/:id", authMiddleware, authorizeRoles("CanteenManager", "NetworkManager"), MenuController.updateMenuStatus);
router.get("/canteen/:canteenId", authMiddleware, MenuController.getMenusByCanteen);

export default router;
