import { Router } from "express";
import { ProductController } from "../Controller/ProductController";

const router = Router();

// CRUD Products
router.post("/", ProductController.createProduct);
router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProduct);

export default router;
