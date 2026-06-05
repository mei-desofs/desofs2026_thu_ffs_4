import { Router } from "express";
import { MenuController } from "../Controller/MenuController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, MenuController.createMenu);
router.get("/week/current", apiLimiter, MenuController.getCurrentWeekMenu);
router.get("/", MenuController.listMenus);
router.get("/:id", MenuController.getMenu);
router.put("/:id", MenuController.updateMenuStatus);
router.get("/canteen/:canteenId", MenuController.getMenusByCanteen);

export default router;
