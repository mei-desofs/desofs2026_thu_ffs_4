import {MenuService} from "../Service/MenuService";
import {Request, Response} from "express";
import {createMenuSchema} from "../Schemas/MenuValidation";

const service = new MenuService()

export class MenuController {

    static async createMenu(req: Request, res: Response) {
        const { error } = createMenuSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {

            console.log("💥 MenuController.createMenu called with body:", req.body);

            const menuData = {
                ...req.body,
            };

            const result = await service.createMenu(menuData);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "FINAL_DATE_MUST_BE_GREATER_THAN_INITIAL_DATE":
                    return res.status(409).json({ error: "Final date must be greater than initial date" });
                case "MENU_TYPE_NOT_FOUND":
                    return res.status(404).json({ error: "Menu type not found" });
                case "MEAL_NOT_FOUND":
                    return res.status(404).json({ error: "Meal not found" });
                case "CANTEEN_NOT_FOUND":
                    return res.status(404).json({ error: "Canteen not found" });
                case "MEAL_CANTEEN_MISMATCH":
                    return res.status(400).json({ error: "Uma ou mais meals não pertencem à cantina especificada" });
                default:
                    return res.status(500).json({ error: err.message || "Internal server error" });
            }
        }
    }

    static async listMenus(req: Request, res: Response) {
        const result = await service.listMenus();
        res.json(result);
    }

    static async getMenu(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const menu = await service.getMenuById(id);
            res.json(menu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND")
                return res.status(404).json({ error: "Menu not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getCurrentWeekMenu(req: Request, res: Response) {
        try {
            const menuTypeId = req.query.menuTypeId ? Number(req.query.menuTypeId) : undefined;
            const weekOffset = req.query.weekOffset ? Number(req.query.weekOffset) : 0;
            
            if (menuTypeId !== undefined && isNaN(menuTypeId)) {
                return res.status(400).json({ error: "Invalid menuTypeId" });
            }
            if (isNaN(weekOffset)) {
                return res.status(400).json({ error: "Invalid weekOffset" });
            }
            
            const menu = await service.getCurrentWeekMenuDetailed(menuTypeId, weekOffset);
            res.json(menu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND") {
                return res.status(404).json({ error: "Menu not found" });
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async updateMenuStatus(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { status } = req.body;
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
        if (!["published", "aproved", "pending"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        try {
            const updatedMenu = await service.updateMenuStatus(id, status);
            res.json(updatedMenu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND") {
                return res.status(404).json({ error: "Menu not found" });
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getMenusByCanteen(req: Request, res: Response) {
        const canteenId = Number(req.params.canteenId);
        if (isNaN(canteenId)) return res.status(400).json({ error: "Invalid canteen ID" });
        try {
            const menus = await service.getMenusByCanteen(canteenId);
            res.json(menus);
        }
        catch (err: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}