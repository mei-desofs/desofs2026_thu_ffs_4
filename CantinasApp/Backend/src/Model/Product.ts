import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";
import { ProductType } from "./ProductType";

export interface NutritionEntry {
  typeId: number;      // ID da tabela NutritionType
  percentage: number;
}

export interface ProductAttributes {
  id: number;
  name: string;
  typeId: number;

  nutrition: NutritionEntry[];
  allergens: number[]; // lista de IDs da tabela Allergen
}

export type ProductCreationAttributes = Optional<ProductAttributes, "id">;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public typeId!: number;

  public nutrition!: NutritionEntry[];
  public allergens!: number[];
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    typeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    nutrition: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    allergens: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);
