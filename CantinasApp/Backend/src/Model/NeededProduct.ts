import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface NeededProductAttributes {
    id: number;
    date: Date;
    productId: number;
    mealId: number;
    unit: String;
    quantity: number;
    canteenId: number;
    status: "needed" | "ordered" | "received";
}

export type NeededProductCreationAttributes = Optional<
    NeededProductAttributes,
    "id"
>;

export class NeededProduct
    extends Model<NeededProductAttributes, NeededProductCreationAttributes>
    implements NeededProductAttributes
{
    public id!: number;
    public date!: Date;
    public productId!: number;
    public mealId!: number;
    public unit!: String;
    public quantity!: number;
    public canteenId!: number;
    public status!: "needed" | "ordered" | "received";
}

NeededProduct.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        mealId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("needed", "ordered", "received"),
            allowNull: false,
            defaultValue: "needed",
        },
    },
    {
        sequelize,
        tableName: "needed_products",
    }
);
