import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface StockAttributes {
    id: number;
    updatedDate: Date;
    minimumCapacity: number;
    maximumCapacity: number;
    currentQuantity: number;
    batches: number[];
}

export type StockCreationAttributes = Optional<StockAttributes, "id">;

export class Stock
    extends Model<StockAttributes, StockCreationAttributes>
    implements StockAttributes
{
    public id!: number;
    public updatedDate!: Date;
    public minimumCapacity!: number;
    public maximumCapacity!: number;
    public currentQuantity!: number;
    public batches!: number[];
}

Stock.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        updatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        minimumCapacity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        maximumCapacity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        currentQuantity: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        batches: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
    },
    {
        sequelize,
        tableName: "stocks",
    }
);