import { Router } from "express";
import { AuxiliarController } from "../Controller/AuxiliarController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// Units
router.post("/unit", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createUnit);
router.get("/unit", apiLimiter, authMiddleware, AuxiliarController.listUnits);

// Allergens
router.post("/allergen", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createAllergen);
router.get("/allergen", apiLimiter, authMiddleware, AuxiliarController.listAllergens);

// Nutrition Types
router.post("/nutrition", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createNutritionType);
router.get("/nutrition", apiLimiter, authMiddleware, AuxiliarController.listNutritionTypes);

// Product Types
router.post("/product-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createProductType);
router.get("/product-type", apiLimiter, authMiddleware, AuxiliarController.listProductTypes);

// Dish Types
router.post("/dish-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createDishType);
router.get("/dish-type", apiLimiter, authMiddleware, AuxiliarController.listDishTypes);

// Meal Types
router.post("/meal-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createMealType);
router.get("/meal-type", apiLimiter, authMiddleware, AuxiliarController.listMealTypes);

// Menu Types
router.post("/menu-type", authLimiter, authMiddleware, authorizeRoles("NetworkManager"), AuxiliarController.createMenuType);
router.get("/menu-type", apiLimiter, authMiddleware, AuxiliarController.listMenuTypes);

router.get("/ordered-suppliers", apiLimiter, authMiddleware, AuxiliarController.listOrderedSuppliers);

export default router;
