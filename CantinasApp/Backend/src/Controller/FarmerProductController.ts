import { Request, Response } from "express";
import { FarmerProductService } from "../Service/FarmerProductsService";
import Joi from "joi";

const service = new FarmerProductService();

const productSchema = Joi.object({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required(),
});

const farmerProductsSchema = Joi.array().items(
  Joi.object({
    week: Joi.number().integer().required(),
    products: Joi.array().items(productSchema).required(),
  })
);

export class FarmerProductController {

  static async create(req: Request, res: Response) {
    const { userId, applicationId, farmerProducts } = req.body;
    const { error } = farmerProductsSchema.validate(farmerProducts);
    if (error) return res.status(400).json({ error: error.message });

    try {
      const result = await service.createFarmerProducts(userId, applicationId, farmerProducts);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async list(req: Request, res: Response) {
    const result = await service.listFarmerProducts();
    res.json(result);
  }

  static async getByApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    if (isNaN(applicationId)) return res.status(400).json({ error: "Invalid applicationId" });

    const result = await service.getByApplication(applicationId);
    res.json(result);
  }
}
