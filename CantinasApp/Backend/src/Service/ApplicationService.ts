import { Application } from "../Model/Application";
import { FarmerProductService } from "../Service/FarmerProductsService";
import { ParishService } from "../Service/ParishService";
import { User } from "../Model/User";
import { col, fn, Op } from "sequelize";
import { SupplierOrder } from "../Model/SupplierOrder";
import path from "path";

const farmerService = new FarmerProductService();
const parishService = new ParishService();

interface DocumentInfo {
  filename: string;
  path: string;
}

export class ApplicationService {

  async createApplication(data: {
    userId: number;
    businessEmail: string;
    businessPhone: string;
    documentsSubmitted: DocumentInfo[];
    supplierComment?: string;
    name: string;
    location: string;
    freguesia: string;
    municipio: string;
    evaluationComment?: string;
    status?: "submitted" | "under_review" | "approved" | "rejected" | "cancelled";
    farmerProducts: { week: number; products: { productId: number; quantity: number; unit: string }[] }[];
  }) {

    const exists = await Application.findOne({ where: { userId: data.userId } });
    if (exists) throw new Error("APPLICATION_ALREADY_EXISTS");

    const app = await Application.create({
      userId: data.userId,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      documentsSubmitted: data.documentsSubmitted,
      name: data.name,
      location: data.location,
      freguesia: data.freguesia,
      municipio: data.municipio,
      supplierComment: data.supplierComment,
      evaluationComment: data.evaluationComment,
      status: data.status || "submitted",
    });

    // Criar FarmerProducts
    await farmerService.createFarmerProducts(data.userId, app.id, data.farmerProducts);

    // Criar Freguesia se não existir
    const parish = data.freguesia ? await parishService.getParishByName(data.freguesia) : null;
    if (!parish) {
      await parishService.createParish({name :data.freguesia})
    }

    return Application.findOne({
      where: { id: app.id },
      include: [{ association: "farmerProducts" }],
    });
  }

  async getApplicationByUser(userId: number) {
    const app = await Application.findOne({
      where: { userId },
      include: [{ association: "farmerProducts" }],
    });
    if (!app) throw new Error("APPLICATION_NOT_FOUND");
    return app;
  }

  async getFilePathByApplicationIdAndFileName(
    applicationId: number, 
    filename: string): Promise<string> {
    const app: Application | null = await Application.findOne({
      where: { id: applicationId }
    });
    if (!app) throw new Error("APPLICATION_NOT_FOUND");

    const requestedFile = app
      .documentsSubmitted
      .find(doc => doc.filename === filename);
    if (!requestedFile) throw new Error("DOCUMENT_NOT_FOUND");
    return path.resolve(requestedFile.path);
  }

  async listApplications() {
    return Application.findAll({
      include: [{ association: 'farmerProducts', include: [{ association: 'product' }] }],
    });
  }

  async updateApplication(applicationId: number, data: {
    businessEmail?: string;
    businessPhone?: string;
    documentsSubmitted?: DocumentInfo[];
    supplierComment?: string;
    name?: string;
    location?: string;
    freguesia?: string;
    municipio?: string;
    evaluationComment?: string;
    status?: "submitted" | "under_review" | "approved" | "rejected" | "cancelled";
    farmerProducts?: { week: number; products: { productId: number; quantity: number; unit: string }[] }[];
  }) {
    const app = await Application.findByPk(applicationId);
    if (!app) throw new Error("APPLICATION_NOT_FOUND");

    await app.update(data);

    const parish = data.freguesia ? await parishService.getParishByName(data.freguesia) : null;
    if (!parish) {
      data.freguesia ? await parishService.createParish({name :data.freguesia}): null;
    }

    if (data.farmerProducts) {
      await farmerService.updateFarmerProducts(app.userId, app.id, data.farmerProducts);
    }

    return Application.findOne({
      where: { id: app.id },
      include: [{ association: "farmerProducts" }],
    });
  }

  async acceptApplication(applicationId: number, evaluationComment: string) {
    const app = await Application.findByPk(applicationId);
    if (!app) throw new Error("APPLICATION_NOT_FOUND");
    await app.update({ status: "approved", evaluationComment });

     await User.update({ role: "Supplier" }, { where: { id: app.userId } });

    // se a freguesia do fornecedor não existir na tabela das freguesias, criar nova freguesia
    const parish = await parishService.getParishByName(app.freguesia)
    if (!parish) {
      await parishService.createParish({name :app.freguesia})
    }
    // se a freguesia estiver na tabela, ver se "quarantined" está a true, se estiver, colocar user com status "quarantine"
    const user = await User.findByPk(app.userId);
    if (parish && parish.quarantined) {
      await user?.update({ status: "quarantine" });
    }

    const positionOfAcceptedApplication = await SupplierOrder.count({ where: { applicationDate: {
        [Op.lt]: app.applicationDate,
      } } }) + 1 ;
    await SupplierOrder.update(
      { position: fn('1 +', col('position')), },
      { where: { position: { [Op.gte]: positionOfAcceptedApplication }} }
    );
    await SupplierOrder.create({
      supplierId: app.userId,
      position: positionOfAcceptedApplication ,
      applicationDate: app.applicationDate,
    });

    return app;
  } 
  
  async rejectApplication(applicationId: number, evaluationComment: string) {
    const app = await Application.findByPk(applicationId);
    if (!app) throw new Error("APPLICATION_NOT_FOUND");
    await app.update({ status: "rejected", evaluationComment });
    return app;
  }
}