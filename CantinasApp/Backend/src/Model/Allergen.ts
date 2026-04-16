import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface AllergenAttributes {
  id: number;
  name: string; // lactose, gluten, eggs, etc.
}

export type AllergenCreation = Optional<AllergenAttributes, "id">;

export class Allergen
  extends Model<AllergenAttributes, AllergenCreation>
  implements AllergenAttributes
{
  public id!: number;
  public name!: string;
}

Allergen.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "allergens",
  }
);
