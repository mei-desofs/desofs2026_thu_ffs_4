import { Router } from "express";
import { AuxiliarController } from "../Controller/AuxiliarController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// Units
router.post("/unit", authLimiter, AuxiliarController.createUnit);
router.get("/unit", AuxiliarController.listUnits);

// Allergens
router.post("/allergen", authLimiter, AuxiliarController.createAllergen);
router.get("/allergen", AuxiliarController.listAllergens);

// Nutrition Types
router.post("/nutrition", authLimiter, AuxiliarController.createNutritionType);
router.get("/nutrition", AuxiliarController.listNutritionTypes);

// Product Types
router.post("/product-type", authLimiter, AuxiliarController.createProductType);
router.get("/product-type", AuxiliarController.listProductTypes);

// Dish Types
router.post("/dish-type", authLimiter, AuxiliarController.createDishType);
router.get("/dish-type", AuxiliarController.listDishTypes);

// Meal Types
router.post("/meal-type", authLimiter, AuxiliarController.createMealType);
router.get("/meal-type", AuxiliarController.listMealTypes);

// Menu Types
router.post("/menu-type", authLimiter, AuxiliarController.createMenuType);
router.get("/menu-type", AuxiliarController.listMenuTypes);

router.get("/ordered-suppliers", AuxiliarController.listOrderedSuppliers);

export default router;
