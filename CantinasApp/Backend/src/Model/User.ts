import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "Supplier" | "NetworkManager" | "Nutritionist" | "Student" | "Visitor" |"NursingHome" | "RefectoryStaff" | "StockManager" | "CanteenManager" | "RefectoryManager";
    status: "enabled" | "disabled" | "quarantine";
    refeitorioId?: number; // Para RefectoryManager e RefectoryStaff
    canteenId?: number; // Para CanteenManager
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "refeitorioId" | "canteenId">;

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: "Supplier" | "NetworkManager" | "Nutritionist" | "Student" | "Visitor" | "NursingHome" | "RefectoryStaff" | "StockManager" | "CanteenManager" | "RefectoryManager";
    public status!: "enabled" | "disabled" | "quarantine";
    public refeitorioId?: number;
    public canteenId?: number;
}

User.init(
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
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("Supplier", "NetworkManager", "Nutritionist", "Student", "Visitor", "NursingHome" , "RefectoryStaff", "StockManager", "CanteenManager", "RefectoryManager"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("enabled", "disabled", "quarantine"),
            allowNull: false,
            defaultValue: "enabled",
        },
        refeitorioId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "refeitorios",
                key: "id",
            },
        },
        canteenId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "canteens",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);