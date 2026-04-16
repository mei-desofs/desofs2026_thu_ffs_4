import { Allergen } from "../Model/Allergen";
import { NutritionType } from "../Model/NutritionType";
import { ProductType } from "../Model/ProductType";
import { DishType } from "../Model/DishType";
import { MealType } from "../Model/MealType";
import { MenuType } from "../Model/MenuType";
import { Unit, UnitEnum } from "../Model/Unit";
import { SupplierOrder } from "../Model/SupplierOrder";

export class AuxiliarService {

  // -------------------
  // ALLERGENS
  // -------------------
  async createAllergen(data: { name: string }) {
    const exists = await Allergen.findOne({ where: { name: data.name } });
    if (exists) throw new Error("ALLERGEN_ALREADY_EXISTS");
    return Allergen.create(data);
  }

  async listAllergens() {
    return Allergen.findAll();
  }

  // -------------------
  // NUTRITION TYPES
  // -------------------
  async createNutritionType(data: { name: string }) {
    const exists = await NutritionType.findOne({ where: { name: data.name } });
    if (exists) throw new Error("NUTRITION_TYPE_ALREADY_EXISTS");
    return NutritionType.create(data);
  }

  async listNutritionTypes() {
    return NutritionType.findAll();
  }

  // -------------------
  // PRODUCT TYPES
  // -------------------
  async createProductType(data: { name: string }) {
    const exists = await ProductType.findOne({ where: { name: data.name } });
    if (exists) throw new Error("PRODUCT_TYPE_ALREADY_EXISTS");
    return ProductType.create(data);
  }

  async listProductTypes() {
    return ProductType.findAll();
  }

  // -------------------
  // UNITS
  // -------------------
  async createUnit(data: { name: string }) {
    const exists = await Unit.findOne({ where: { name: data.name } });
    if (exists) throw new Error("UNIT_ALREADY_EXISTS");
    return Unit.create({ ...data, name: data.name as UnitEnum });
  }

  async listUnits() {
      return Unit.findAll();
  }

  // -------------------
  // DISH TYPES
  // -------------------
  async createDishType(data: { name: string }) {
      const exists = await DishType.findOne({ where: { name: data.name } });
      if (exists) throw new Error("DISH_TYPE_ALREADY_EXISTS");
      return DishType.create(data);
  }

  async listDishTypes() {
      return DishType.findAll();
  }

  // -------------------
  // MEAL TYPES
  // -------------------
  async createMealType(data: { name: string }) {
      const exists = await MealType.findOne({ where: { name: data.name } });
      if (exists) throw new Error("MEAL_TYPE_ALREADY_EXISTS");
      return MealType.create(data);
  }

  async listMealTypes() {
      return MealType.findAll();
  }

  // -------------------
  // MENU TYPES
  // -------------------
  async createMenuType(data: { name: string }) {
      const exists = await MenuType.findOne({ where: { name: data.name } });
      if (exists) throw new Error("MENU_TYPE_ALREADY_EXISTS");
      return MenuType.create(data);
  }

  async listMenuTypes() {
      return MenuType.findAll();
  }

  async listOrderedSuppliers() {
    // Assuming Supplier model has 'name' and 'position' fields
    return SupplierOrder.findAll({ order: [["position", "ASC"]] });
  }
}
