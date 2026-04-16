import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export enum UnitEnum {
  Gram = "g",
  Kilogram = "kg",
  Liter = "L",
  Milliliter = "mL",
  Unit = "unit",
  Box = "box",
}

interface UnitAttributes {
  id: number;
  name: UnitEnum;
}

type UnitCreationAttributes = Optional<UnitAttributes, "id">;

export class Unit
  extends Model<UnitAttributes, UnitCreationAttributes>
  implements UnitAttributes
{
  public id!: number;
  public name!: UnitEnum;
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM(...Object.values(UnitEnum)),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "units",
  }
);
