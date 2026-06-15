import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";

interface LoginAuditAttributes {
  id: number;
  userId?: number;
  email: string;
  ipAddress: string;
  userAgent?: string;
  status: "success" | "failed" | "blocked";
  reason?: string;
  createdAt: Date;
}

type LoginAuditCreationAttributes = Optional<
  LoginAuditAttributes,
  "id" | "createdAt"
>;

export class LoginAudit
  extends Model<LoginAuditAttributes, LoginAuditCreationAttributes>
  implements LoginAuditAttributes
{
  public id!: number;
  public userId?: number;
  public email!: string;
  public ipAddress!: string;
  public userAgent?: string;
  public status!: "success" | "failed" | "blocked";
  public reason?: string;
  public createdAt!: Date;
}

LoginAudit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("success", "failed", "blocked"),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "login_audits",
    timestamps: false,
  },
);
