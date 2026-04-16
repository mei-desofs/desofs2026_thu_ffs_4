import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface MenuTypeAttributes {
    id: number;
    name: string;
}

export type MenuTypeCreationAttributes = Optional<MenuTypeAttributes, "id">;

export class MenuType
    extends Model<MenuTypeAttributes, MenuTypeCreationAttributes>
    implements MenuTypeAttributes
{
    public id!: number;
    public name!: string;
}

MenuType.init(
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
        tableName: "menu_types",
    }
);
