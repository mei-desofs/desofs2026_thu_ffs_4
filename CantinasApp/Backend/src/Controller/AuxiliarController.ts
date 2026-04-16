import { Request, Response } from "express";
import { AuxiliarService } from "../Service/AuxiliarService";
import Joi from "joi";

const service = new AuxiliarService();

// -------------------
// Validações
// -------------------
const createGenericTypeSchema = Joi.object({ name: Joi.string().min(2).max(50).required() });
const createUnitSchema = Joi.object({ name: Joi.string().valid("g", "kg", "L", "mL", "unit", "box").required() });

export class AuxiliarController {

  // -------------------
  // ALLERGENS
  // -------------------
  static async createAllergen(req: Request, res: Response) {
    const { error } = createGenericTypeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const result = await service.createAllergen(req.body);
      res.json(result);
    } catch (err: any) {
      if (err.message === "ALLERGEN_ALREADY_EXISTS")
        return res.status(409).json({ error: "Allergen already exists" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listAllergens(req: Request, res: Response) {
    const result = await service.listAllergens();
    res.json(result);
  }

  // -------------------
  // NUTRITION TYPES
  // -------------------
  static async createNutritionType(req: Request, res: Response) {
    const { error } = createGenericTypeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const result = await service.createNutritionType(req.body);
      res.json(result);
    } catch (err: any) {
      if (err.message === "NUTRITION_TYPE_ALREADY_EXISTS")
        return res.status(409).json({ error: "Nutrition type already exists" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listNutritionTypes(req: Request, res: Response) {
    const result = await service.listNutritionTypes();
    res.json(result);
  }

  // -------------------
  // PRODUCT TYPES
  // -------------------
  static async createProductType(req: Request, res: Response) {
    const { error } = createGenericTypeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const result = await service.createProductType(req.body);
      res.json(result);
    } catch (err: any) {
      if (err.message === "PRODUCT_TYPE_ALREADY_EXISTS")
        return res.status(409).json({ error: "Product type already exists" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listProductTypes(req: Request, res: Response) {
    const result = await service.listProductTypes();
    res.json(result);
  }

  // -------------------
  // UNITS
  // -------------------
  static async createUnit(req: Request, res: Response) {
    const { error } = createUnitSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const result = await service.createUnit(req.body);
      res.json(result);
    } catch (err: any) {
      if (err.message === "UNIT_ALREADY_EXISTS")
        return res.status(409).json({ error: "Unit already exists" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listUnits(req: Request, res: Response) {
    const result = await service.listUnits();
    res.json(result);
  }

  // -------------------
  // DISH TYPES
  // -------------------
  static async createDishType(req: Request, res: Response) {
      const { error } = createGenericTypeSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });

      try {
          const result = await service.createDishType(req.body);
          res.json(result);
      } catch (err: any) {
          if (err.message === "DISH_TYPE_ALREADY_EXISTS")
              return res.status(409).json({ error: "Dish type already exists" });
          res.status(500).json({ error: "Internal server error" });
      }
  }

  static async listDishTypes(req: Request, res: Response) {
      const result = await service.listDishTypes();
      res.json(result);
  }

  // -------------------
  // MEAL TYPES
  // -------------------
  static async createMealType(req: Request, res: Response) {
      const { error } = createGenericTypeSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });

      try {
          const result = await service.createMealType(req.body);
          res.json(result);
      } catch (err: any) {
          if (err.message === "MEAL_TYPE_ALREADY_EXISTS")
              return res.status(409).json({ error: "Meal type already exists" });
          res.status(500).json({ error: "Internal server error" });
      }
  }

  static async listMealTypes(req: Request, res: Response) {
      const result = await service.listMealTypes();
      res.json(result);
  }

  // -------------------
  // MENU TYPES
  // -------------------
  static async createMenuType(req: Request, res: Response) {
      const { error } = createGenericTypeSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });

      try {
          const result = await service.createMenuType(req.body);
          res.json(result);
      } catch (err: any) {
          if (err.message === "MENU_TYPE_ALREADY_EXISTS")
              return res.status(409).json({ error: "Menu type already exists" });
          res.status(500).json({ error: "Internal server error" });
      }
  }

  static async listMenuTypes(req: Request, res: Response) {
      const result = await service.listMenuTypes();
      res.json(result);
  }

  static async listOrderedSuppliers(req: Request, res: Response) {
    try {
      const result = await service.listOrderedSuppliers();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
}
}
