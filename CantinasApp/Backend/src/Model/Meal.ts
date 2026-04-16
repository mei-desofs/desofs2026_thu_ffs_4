import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface MealAttributes {
    id: number;
    mealTypeId: number;
    name: string;
    date: Date;
    dishId: number;
    canteenId: number; // Onde a refeição foi produzida
    refeitorioId: number; // Onde a refeição será servida
}

export type MealCreationAttributes = Optional<MealAttributes, "id">;

export class Meal
    extends Model<MealAttributes, MealCreationAttributes>
    implements MealAttributes
{
    public id!: number;
    public mealTypeId!: number;
    public name!: string;
    public date!: Date;
    public dishId!: number;
    public canteenId!: number;
    public refeitorioId!: number;
}

Meal.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        mealTypeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        dishId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "canteens",
                key: "id",
            },
        },
        refeitorioId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "refeitorios",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "meals",
    }
);