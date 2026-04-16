import { Product } from "../Model/Product";
import { ProductType } from "../Model/ProductType";
import { Unit } from "../Model/Unit";
import { NutritionType } from "../Model/NutritionType";
import { Allergen } from "../Model/Allergen";

export class ProductService {

  async createProduct(data: {
    name: string;
    typeId: number;
    unitId: number;
    nutrition: { typeId: number; percentage: number }[];
    allergens: number[];
  }) {
    // verificar duplicados pelo nome
    const exists = await Product.findOne({ where: { name: data.name } });
    if (exists) throw new Error("PRODUCT_ALREADY_EXISTS");

    // validar existência de IDs
    const type = await ProductType.findByPk(data.typeId);
    if (!type) throw new Error("PRODUCT_TYPE_NOT_FOUND");

    const unit = await Unit.findByPk(data.unitId);
    if (!unit) throw new Error("UNIT_NOT_FOUND");

    // validar nutrition types
    for (const n of data.nutrition) {
      const nt = await NutritionType.findByPk(n.typeId);
      if (!nt) throw new Error(`NUTRITION_TYPE_NOT_FOUND: ${n.typeId}`);
    }

    // validar allergens
    for (const aId of data.allergens) {
      const allergen = await Allergen.findByPk(aId);
      if (!allergen) throw new Error(`ALLERGEN_NOT_FOUND: ${aId}`);
    }

    return Product.create(data);
  }

  async listProducts() {
    return Product.findAll();
  }

  async getProductById(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    return product;
  }
}
