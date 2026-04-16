import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface RefeitorioAttributes {
  id: number;
  name: string;
  institutionId?: number;
  location: string;
  freguesia?: string;
  municipio?: string;
}

export type RefeitorioCreationAttributes = Optional<RefeitorioAttributes, "id" | "institutionId">;

export class Refeitorio
  extends Model<RefeitorioAttributes, RefeitorioCreationAttributes>
  implements RefeitorioAttributes
{
  public id!: number;
  public name!: string;
  public institutionId?: number;
  public location!: string;
  public freguesia?: string;
  public municipio?: string;
}

Refeitorio.init(
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
    institutionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "institutions",
        key: "id",
      },
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    freguesia: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    municipio: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "refeitorios",
  }
);

