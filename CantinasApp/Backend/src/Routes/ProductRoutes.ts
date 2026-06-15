import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authLimiter, authMiddleware, authorizeRoles("Supplier", "NetworkManager"), ProductController.createProduct);
router.get("/", apiLimiter, authMiddleware, ProductController.listProducts);
router.get("/:id", apiLimiter, authMiddleware, ProductController.getProduct);

export default router;
