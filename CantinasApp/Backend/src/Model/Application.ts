import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../Config/db";
import { User } from "./User";
import { FarmerProduct } from "./FarmerProducts";

export interface DocumentInfo {
  filename: string;
  path: string;
}

export interface ApplicationAttributes {
  id: number;
  applicationDate: Date;
  userId: number;
  status: "submitted" | "under_review" | "approved" | "rejected" | "cancelled";
  documentsSubmitted: DocumentInfo[];
  supplierComment?: string;
  name: string;
  location: string;
  freguesia: string;
  municipio: string;
  businessEmail: string;
  businessPhone: string;
  evaluationComment?: string;
}

export type ApplicationCreationAttributes = Optional<ApplicationAttributes, "id" | "applicationDate">;

export class Application
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: number;
  public applicationDate!: Date;
  public userId!: number;
  public status!: "submitted" | "under_review" | "approved" | "rejected" | "cancelled";
  public documentsSubmitted!: DocumentInfo[];
  public supplierComment?: string;
  public name!: string;
  public location!: string;
  public freguesia!: string;
  public municipio!: string;
  public businessEmail!: string;
  public businessPhone!: string;
  public evaluationComment?: string;
}

Application.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    applicationDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: {
      type: DataTypes.ENUM("submitted", "under_review", "approved", "rejected", "cancelled"),
      allowNull: false,
      defaultValue: "submitted",
    },
    documentsSubmitted: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    supplierComment: { type: DataTypes.TEXT, allowNull: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    location: { type: DataTypes.STRING(150), allowNull: false },
    freguesia: { type: DataTypes.STRING(150), allowNull: true },
    municipio: { type: DataTypes.STRING(150), allowNull: true },
    businessEmail: { type: DataTypes.STRING(150), allowNull: false },
    businessPhone: { type: DataTypes.STRING(50), allowNull: false },
    evaluationComment: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "applications" }
);
