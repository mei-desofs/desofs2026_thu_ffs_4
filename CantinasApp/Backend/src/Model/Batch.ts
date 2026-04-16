import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface BatchAttributes {
    id: number;
    expirationDate: Date;
    productId: number;
    quantity: number;
    unitId: number;
    bio: boolean;
}

export type BatchCreationAttributes = Optional<BatchAttributes, "id">;

export class Batch
    extends Model<BatchAttributes, BatchCreationAttributes>
    implements BatchAttributes
{
    public id!: number;
    public expirationDate!: Date;
    public productId!: number;
    public quantity!: number;
    public unitId!: number;
    public bio!: boolean;
}

Batch.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        unitId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        bio: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "batches",
    }
);