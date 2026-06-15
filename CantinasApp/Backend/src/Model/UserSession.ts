import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

interface UserSessionAttributes {
  id: number;
  userId: number;
  sessionId: string;
  issuedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedReason?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

type UserSessionCreationAttributes = Optional<
  UserSessionAttributes,
  "id" | "revokedAt" | "revokedReason" | "ipAddress" | "userAgent"
>;

export class UserSession
  extends Model<UserSessionAttributes, UserSessionCreationAttributes>
  implements UserSessionAttributes
{
  public id!: number;
  public userId!: number;
  public sessionId!: string;
  public issuedAt!: Date;
  public lastActivityAt!: Date;
  public expiresAt!: Date;
  public revokedAt?: Date | null;
  public revokedReason?: string | null;
  public ipAddress?: string | null;
  public userAgent?: string | null;
}

UserSession.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    sessionId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    revokedReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_sessions",
    indexes: [
      { fields: ["userId"] },
      { fields: ["sessionId"], unique: true },
      { fields: ["expiresAt"] },
      { fields: ["revokedAt"] },
    ],
  },
);
