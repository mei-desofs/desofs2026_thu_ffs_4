import {ParishService} from "../Service/ParishService";
import {Request, Response} from "express";
import {createParishSchema} from "../Schemas/ParishValidation";

const service = new ParishService();

export class ParishController {

    static async createParish(req: Request, res: Response) {
        const { error } = createParishSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        try {
            const result = await service.createParish(req.body);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "PARISH_ALREADY_EXISTS":
                    return res.status(404).json({ error: "Parish already exists" });
            }
        }
    }

    static async listParishes(req: Request, res: Response) {
        const result = await service.listParishes();
        res.json(result);
    }

    static async getParish(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

        try {
            const parish = await service.getParishById(id);
            res.json(parish);
        } catch (err: any) {
            if (err.message === "PARISH_NOT_FOUND")
                return res.status(404).json({ error: "Parish not found" });
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async quarantineParish(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const parish = await service.quarantineParish(Number(id));
            if (!parish) {
                return res.status(404).json({ message: "Parish not found" });
            }
            return res.status(200).json(parish);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async takeParishOfQuarantine(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const parish = await service.takeParishOfQuarantine(Number(id));
            if (!parish) {
                return res.status(404).json({ message: "Parish not found" });
            }
            return res.status(200).json(parish);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}