import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface ProductTypeAttributes {
  id: number;
  name: string; 
}

export type ProductTypeCreationAttributes = Optional<ProductTypeAttributes, "id">;

export class ProductType
  extends Model<ProductTypeAttributes, ProductTypeCreationAttributes>
  implements ProductTypeAttributes
{
  public id!: number;
  public name!: string;
}

ProductType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "product_types",
  }
);
