import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export interface WasteReportAttributes {
    id: number;
    wastePercentage: number; // 0-100
    mealId: number;
    reservationId?: number; // Opcional
    reportedBy: number; // ID do canteen staff
    reportedAt: Date;
    refeitorioId: number; // Onde o desperdício foi reportado
}

export type WasteReportCreationAttributes = Optional<WasteReportAttributes, "id" | "reportedAt">;

export class WasteReport
    extends Model<WasteReportAttributes, WasteReportCreationAttributes>
    implements WasteReportAttributes
{
    public id!: number;
    public wastePercentage!: number;
    public mealId!: number;
    public reservationId?: number;
    public reportedBy!: number;
    public reportedAt!: Date;
    public refeitorioId!: number;
}

WasteReport.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        wastePercentage: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        mealId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        reservationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        reportedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        reportedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
        tableName: "waste_reports",
    }
);









