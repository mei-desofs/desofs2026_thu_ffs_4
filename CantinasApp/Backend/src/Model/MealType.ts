import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface MealTypeAttributes {
    id: number;
    name: string;
}

export type MealTypeCreationAttributes = Optional<MealTypeAttributes, "id">;

export class MealType
    extends Model<MealTypeAttributes, MealTypeCreationAttributes>
    implements MealTypeAttributes
{
    public id!: number;
    public name!: string;
}

MealType.init(
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
        tableName: "meal_types",
    }
);
