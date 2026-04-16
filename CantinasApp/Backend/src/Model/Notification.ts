import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

export type NotificationStatus = "sent" | "seen";

export interface NotificationAttributes {
    id: number;
    userId: number;
    title: string;
    body: string;
    status: NotificationStatus;
}

export type NotificationCreationAttributes = Optional<
    NotificationAttributes,
    "id" | "status"
>;

export class Notification
    extends Model<NotificationAttributes, NotificationCreationAttributes>
    implements NotificationAttributes
{
    public id!: number;
    public userId!: number;
    public title!: string;
    public body!: string;
    public status!: NotificationStatus;
}

Notification.init(
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
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("sent", "seen"),
            allowNull: false,
            defaultValue: "sent",
        },
    },
    {
        sequelize,
        tableName: "notifications",
    }
);
