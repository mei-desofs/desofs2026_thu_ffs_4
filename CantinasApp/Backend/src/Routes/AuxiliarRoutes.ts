import { Router } from "express";
import { AuxiliarController } from "../Controller/AuxiliarController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// Units
router.post("/unit", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createUnit);
router.get("/unit", authMiddleware, AuxiliarController.listUnits);

// Allergens
router.post("/allergen", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createAllergen);
router.get("/allergen", authMiddleware, AuxiliarController.listAllergens);

// Nutrition Types
router.post("/nutrition", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createNutritionType);
router.get("/nutrition", authMiddleware, AuxiliarController.listNutritionTypes);

// Product Types
router.post("/product-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createProductType);
router.get("/product-type", authMiddleware, AuxiliarController.listProductTypes);

// Dish Types
router.post("/dish-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createDishType);
router.get("/dish-type", authMiddleware, AuxiliarController.listDishTypes);

// Meal Types
router.post("/meal-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createMealType);
router.get("/meal-type", authMiddleware, AuxiliarController.listMealTypes);

// Menu Types
router.post("/menu-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createMenuType);
router.get("/menu-type", authMiddleware, AuxiliarController.listMenuTypes);

router.get("/ordered-suppliers", authMiddleware, AuxiliarController.listOrderedSuppliers);

export default router;
