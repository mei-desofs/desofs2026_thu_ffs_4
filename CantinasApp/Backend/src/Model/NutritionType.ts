import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface NutritionTypeAttributes {
  id: number;
  name: string; // "protein", "fat", "fiber", etc.
}

export type NutritionTypeCreation = Optional<NutritionTypeAttributes, "id">;

export class NutritionType
  extends Model<NutritionTypeAttributes, NutritionTypeCreation>
  implements NutritionTypeAttributes
{
  public id!: number;
  public name!: string;
}

NutritionType.init(
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
    tableName: "nutrition_types",
  }
);
