import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface ReservationQuantitiesCanteenAttributes {
    id: number;
    canteenId: number; // Cantina que produziu
    dishId: number; // Prato produzido
    date: Date; // Data de produção
    refeitorioId: number; // Refeitório de destino
    quantity: number; // Quantidade total de pratos produzidos (soma das quantities das reservas)
}

export type ReservationQuantitiesCanteenCreationAttributes = Optional<ReservationQuantitiesCanteenAttributes, "id">;

export class ReservationQuantitiesCanteen
    extends Model<ReservationQuantitiesCanteenAttributes, ReservationQuantitiesCanteenCreationAttributes>
    implements ReservationQuantitiesCanteenAttributes
{
    public id!: number;
    public canteenId!: number;
    public dishId!: number;
    public date!: Date;
    public refeitorioId!: number;
    public quantity!: number;
}

ReservationQuantitiesCanteen.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "canteens",
                key: "id",
            },
        },
        dishId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "dishes",
                key: "id",
            },
        },
        date: {
            type: DataTypes.DATE,
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
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "reservation_quantities_canteen",
        indexes: [
            {
                unique: true,
                fields: ["canteenId", "dishId", "date", "refeitorioId"],
                name: "unique_canteen_dish_date_refeitorio"
            }
        ]
    }
);

