import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface ReservationAttributes {
    id: number;
    status: "active" | "consumed" | "not consumed" | "pendent" | "canceled";
    reservationDate: Date;
    quantity: number;
    mealId: number;
    userId: number;
    refeitorioId: number; // Onde a reserva foi consumida/servida
}

export type ReservationCreationAttributes = Optional<ReservationAttributes, "id">;

export class Reservation
    extends Model<ReservationAttributes, ReservationCreationAttributes>
    implements ReservationAttributes
{
    public id!: number;
    public status!: "active" | "consumed" | "not consumed" | "pendent" | "canceled";
    public reservationDate!: Date;
    public quantity!: number;
    public mealId!: number;
    public userId!: number;
    public refeitorioId!: number;
}

Reservation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM("active", "consumed", "not consumed", "pendent", "canceled"),
            allowNull: false,
        },
        reservationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        mealId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
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
        tableName: "reservations",
    }
);


