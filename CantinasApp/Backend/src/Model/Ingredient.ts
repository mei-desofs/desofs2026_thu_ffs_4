import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface IngredientAttributes {
    id: number;
    productId: number;
    quantity: number;
    unitId: number;
}

export type IngredientCreationAttributes = Optional<IngredientAttributes, "id">;

export class Ingredient
    extends Model<IngredientAttributes, IngredientCreationAttributes>
    implements IngredientAttributes
{
    public id!: number;
    public productId!: number;
    public quantity!: number;
    public unitId!: number;
}

Ingredient.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        unitId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "ingredients",
    }
);