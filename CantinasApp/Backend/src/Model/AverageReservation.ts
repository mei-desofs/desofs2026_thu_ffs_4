import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface AverageReservationAttributes {
    id: number;
    dishId: number;
    typeOfMealId: 1 | 2;
    avgReservations: number;
    canteenId: number;
}

export type AverageReservationCreationAttributes = Optional<
    AverageReservationAttributes,
    "id"
>;

export class AverageReservation
    extends Model<
        AverageReservationAttributes,
        AverageReservationCreationAttributes
    >
    implements AverageReservationAttributes
{
    public id!: number;
    public dishId!: number;
    public typeOfMealId!: 1 | 2;
    public avgReservations!: number;
    public canteenId!: number;
}

AverageReservation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        dishId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        typeOfMealId: {
            type: DataTypes.ENUM("1", "2"),
            allowNull: false,
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        avgReservations: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "average_reservations",
    }
);
