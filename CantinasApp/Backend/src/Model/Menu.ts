import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface MenuAttributes {
    id: number;
    menuTypeId: number;
    initialDate: Date;
    finalDate: Date;
    meals: number[];
    status: "published" | "aproved" | "pending";
    canteenId: number; // Cantina à qual o menu pertence
}

export type MenuCreationAttributes = Optional<MenuAttributes, "id">;

export class Menu
    extends Model<MenuAttributes, MenuCreationAttributes>
    implements MenuAttributes
{
    public id!: number;
    public menuTypeId!: number;
    public initialDate!: Date;
    public finalDate!: Date;
    public meals!: number[];
    public status!: "published" | "aproved" | "pending";
    public canteenId!: number;
}

Menu.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        menuTypeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        initialDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        finalDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        meals: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("published", "aproved", "pending"),
            allowNull: false,
            defaultValue: "pending",
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "canteens",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "menus",
    }
);