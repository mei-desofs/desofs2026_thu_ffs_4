import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface DishTypeAttributes {
    id: number;
    name: string;
}

export type DishTypeCreationAttributes = Optional<DishTypeAttributes, "id">;

export class DishType
    extends Model<DishTypeAttributes, DishTypeCreationAttributes>
    implements DishTypeAttributes
{
    public id!: number;
    public name!: string;
}

DishType.init(
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
        tableName: "dish_types",
    }
);
