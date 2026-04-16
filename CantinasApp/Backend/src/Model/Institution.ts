import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface InstitutionAttributes {
  id: number;
  name: string;
  idmenutype: number; // Referência ao MenuType
  location: string; // Rua e número da porta
  freguesia?: string;
  municipio?: string;
}

export type InstitutionCreationAttributes = Optional<InstitutionAttributes, "id">;

export class Institution
  extends Model<InstitutionAttributes, InstitutionCreationAttributes>
  implements InstitutionAttributes
{
  public id!: number;
  public name!: string;
  public idmenutype!: number;
  public location!: string;
  public freguesia?: string;
  public municipio?: string;
}

Institution.init(
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
    tableName: "institutions",
  }
);

