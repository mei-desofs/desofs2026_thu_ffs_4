import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface ParishAttributes {
    id: number;
    name: string;
    quarantined: boolean;
}

export type ParishCreationAttributes = Optional<ParishAttributes, "id" | "quarantined">;

export class Parish
    extends Model<ParishAttributes, ParishCreationAttributes>
    implements ParishAttributes
{
    public id!: number;
    public name!: string;
    public quarantined!: boolean;
}

Parish.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        quarantined: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "parishes",
    }
);