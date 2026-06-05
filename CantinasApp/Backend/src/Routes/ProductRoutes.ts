import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();

// CRUD Products
router.post("/", authLimiter, ProductController.createProduct);
router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProduct);

export default router;
