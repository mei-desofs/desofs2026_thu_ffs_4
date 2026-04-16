import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export type OrderStatus =
    | "pending"
    | "sent"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "delivered";

export interface OrderAttributes {
    id: number;
    userId: number;
    neededProductId: number ;
    productId: number;
    unit: String;
    quantity: number;
    status: OrderStatus;
    date: Date;
    canteenId: number;
}

export type OrderCreationAttributes = Optional<
    OrderAttributes,
    "id" | "status"
>;

export class Order
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    public id!: number;
    public userId!: number;
    public neededProductId!: number;
    public productId!: number;
    public unit!: String;
    public quantity!: number;
    public status!: OrderStatus;
    public date!: Date;
    public canteenId!: number;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        neededProductId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        productId: {
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
        status: {
            type: DataTypes.ENUM(
                "pending",
                "sent",
                "confirmed",
                "rejected",
                "cancelled",
                "delivered"
            ),
            allowNull: false,
            defaultValue: "pending",
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "orders",
    }
);
