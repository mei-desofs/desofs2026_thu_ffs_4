import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface CanteenRefeitorioAttributes {
  id: number;
  canteenId: number;
  refeitorioId: number;
}

export type CanteenRefeitorioCreationAttributes = Optional<CanteenRefeitorioAttributes, "id">;

export class CanteenRefeitorio
  extends Model<CanteenRefeitorioAttributes, CanteenRefeitorioCreationAttributes>
  implements CanteenRefeitorioAttributes
{
  public id!: number;
  public canteenId!: number;
  public refeitorioId!: number;
}

CanteenRefeitorio.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    canteenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "canteens",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    refeitorioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "refeitorios",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "canteen_refeitorios",
    indexes: [
      {
        unique: true,
        fields: ["canteenId", "refeitorioId"],
        name: "unique_canteen_refeitorio",
      },
    ],
  }
);

