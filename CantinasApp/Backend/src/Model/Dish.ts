import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface DishAttributes {
    id: number;
    dishTypeId: number;
    name: string;
    recipeId: number;
    mainProductsId: number[];
}

export type DishCreationAttributes = Optional<DishAttributes, "id">;

export class Dish
    extends Model<DishAttributes, DishCreationAttributes>
    implements DishAttributes
{
    public id!: number;
    public dishTypeId!: number;
    public name!: string;
    public recipeId!: number;
    public mainProductsId!: number[];
}

Dish.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        dishTypeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        recipeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        mainProductsId: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "dishes",
    }
);