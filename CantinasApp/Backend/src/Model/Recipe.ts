import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface RecipeAttributes {
    id: number;
    ingredients: number[];
    description: string;
}

export type RecipeCreationAttributes = Optional<RecipeAttributes, "id">;

export class Recipe
    extends Model<RecipeAttributes, RecipeCreationAttributes>
    implements RecipeAttributes
{
    public id!: number;
    public ingredients!: number[];
    public description!: string;
}

Recipe.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        ingredients: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "recipes",
    }
);