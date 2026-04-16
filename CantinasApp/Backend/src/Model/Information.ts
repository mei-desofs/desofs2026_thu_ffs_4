import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface InformationAttributes {
    id: number;
    avgClientsLunch: number;
    avgClientsDinner: number;
}

export type InformationCreationAttributes = Optional<
    InformationAttributes,
    "id"
>;

export class Information
    extends Model<InformationAttributes, InformationCreationAttributes>
    implements InformationAttributes
{
    public id!: number;
    public avgClientsLunch!: number;
    public avgClientsDinner!: number;
}

Information.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        avgClientsLunch: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        avgClientsDinner: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "information",
    }
);
