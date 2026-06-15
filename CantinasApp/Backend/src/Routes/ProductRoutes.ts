import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { authLimiter } from "../middlewares/rateLimit";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// CRUD Products
router.post("/", authMiddleware, authorizeRoles("Supplier", "NetworkManager"), authLimiter, ProductController.createProduct);
router.get("/", authMiddleware, ProductController.listProducts);
router.get("/:id", authMiddleware, ProductController.getProduct);

export default router;
