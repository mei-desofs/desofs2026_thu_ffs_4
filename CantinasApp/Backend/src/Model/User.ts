import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role:
    | "Supplier"
    | "NetworkManager"
    | "Nutritionist"
    | "Student"
    | "Visitor"
    | "NursingHome"
    | "RefectoryStaff"
    | "StockManager"
    | "CanteenManager"
    | "RefectoryManager";
  status: "enabled" | "disabled" | "quarantine";
  refeitorioId?: number; // Para RefectoryManager e RefectoryStaff
  canteenId?: number; // Para CanteenManager
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiry?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpiry?: Date | null;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  failedLoginAttempts?: number;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "refeitorioId"
  | "canteenId"
  | "emailVerified"
  | "emailVerificationToken"
  | "emailVerificationExpiry"
  | "passwordResetToken"
  | "passwordResetExpiry"
  | "lastLoginAt"
  | "lastLoginIp"
  | "failedLoginAttempts"
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!:
    | "Supplier"
    | "NetworkManager"
    | "Nutritionist"
    | "Student"
    | "Visitor"
    | "NursingHome"
    | "RefectoryStaff"
    | "StockManager"
    | "CanteenManager"
    | "RefectoryManager";
  public status!: "enabled" | "disabled" | "quarantine";
  public refeitorioId?: number;
  public canteenId?: number;
  public emailVerified?: boolean;
  public emailVerificationToken?: string | null;
  public emailVerificationExpiry?: Date | null;
  public passwordResetToken?: string | null;
  public passwordResetExpiry?: Date | null;
  public lastLoginAt?: Date | null;
  public lastLoginIp?: string | null;
  public failedLoginAttempts?: number;
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
      type: DataTypes.ENUM(
        "Supplier",
        "NetworkManager",
        "Nutritionist",
        "Student",
        "Visitor",
        "NursingHome",
        "RefectoryStaff",
        "StockManager",
        "CanteenManager",
        "RefectoryManager",
      ),
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
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    emailVerificationExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    passwordResetExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginIp: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);
