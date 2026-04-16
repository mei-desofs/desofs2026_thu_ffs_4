import { Router } from "express";
import { AuxiliarController } from "../Controller/AuxiliarController";

const router = Router();

// Units
router.post("/unit", AuxiliarController.createUnit);
router.get("/unit", AuxiliarController.listUnits);

// Allergens
router.post("/allergen", AuxiliarController.createAllergen);
router.get("/allergen", AuxiliarController.listAllergens);

// Nutrition Types
router.post("/nutrition", AuxiliarController.createNutritionType);
router.get("/nutrition", AuxiliarController.listNutritionTypes);

// Product Types
router.post("/product-type", AuxiliarController.createProductType);
router.get("/product-type", AuxiliarController.listProductTypes);

// Dish Types
router.post("/dish-type", AuxiliarController.createDishType);
router.get("/dish-type", AuxiliarController.listDishTypes);

// Meal Types
router.post("/meal-type", AuxiliarController.createMealType);
router.get("/meal-type", AuxiliarController.listMealTypes);

// Menu Types
router.post("/menu-type", AuxiliarController.createMenuType);
router.get("/menu-type", AuxiliarController.listMenuTypes);

router.get("/ordered-suppliers", AuxiliarController.listOrderedSuppliers);

export default router;
