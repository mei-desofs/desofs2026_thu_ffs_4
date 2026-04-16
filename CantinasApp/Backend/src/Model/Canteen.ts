import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface CanteenAttributes {
  id: number;
  name: string;
  institutionId?: number;
  idmenutype: number; // Referência ao MenuType
  location: string;
  freguesia?: string;
  municipio?: string;
}

export type CanteenCreationAttributes = Optional<CanteenAttributes, "id" | "institutionId">;

export class Canteen
  extends Model<CanteenAttributes, CanteenCreationAttributes>
  implements CanteenAttributes
{
  public id!: number;
  public name!: string;
  public institutionId?: number;
  public idmenutype!: number;
  public location!: string;
  public freguesia?: string;
  public municipio?: string;
}

Canteen.init(
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
    idmenutype: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "menu_types",
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
    tableName: "canteens",
  }
);

