import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";
import { Application } from "./Application";
import { Product } from "./Product";
import { User } from "./User";  // importa User também

export interface FarmerProductAttributes {
  id: number;
  applicationId: number;
  userId: number;
  productId: number;
  week: number;
  quantity: number;
  unit: string;
}

export type FarmerProductCreationAttributes = Optional<FarmerProductAttributes, "id">;

export class FarmerProduct
  extends Model<FarmerProductAttributes, FarmerProductCreationAttributes>
  implements FarmerProductAttributes
{
  public id!: number;
  public applicationId!: number;
  public userId!: number;
  public productId!: number;
  public week!: number;
  public quantity!: number;
  public unit!: string;
}

FarmerProduct.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    applicationId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    week: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
    unit: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    sequelize,
    tableName: "farmer_products",
  }
);
