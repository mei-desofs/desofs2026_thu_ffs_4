import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface SupplierOrderAttributes {
    supplierId: number;
    position: number;
    applicationDate: Date;
}

export type SupplierOrderCreationAttributes = Optional<SupplierOrderAttributes, "supplierId">;

export class SupplierOrder
    extends Model<SupplierOrderAttributes, SupplierOrderCreationAttributes>
    implements SupplierOrderAttributes
{
    public supplierId!: number;
    public position!: number;
    public applicationDate!: Date;
}

SupplierOrder.init(
    {
        supplierId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        position: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        applicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "supplier_orders",
    }
);