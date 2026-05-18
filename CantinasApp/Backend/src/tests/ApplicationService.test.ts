import { ApplicationService } from "../Service/ApplicationService";
import { Application } from "../Model/Application";
import { User } from "../Model/User";
import { SupplierOrder } from "../Model/SupplierOrder";
import path from "path";

jest.mock("../Service/FarmerProductsService", () => {
  return {
    FarmerProductService: jest.fn().mockImplementation(() => ({
      createFarmerProducts: jest.fn(),
      updateFarmerProducts: jest.fn(),
    })),
  };
});

jest.mock("../Service/ParishService", () => {
  return {
    ParishService: jest.fn().mockImplementation(() => ({
      getParishByName: jest.fn(),
      createParish: jest.fn(),
    })),
  };
});


jest.mock("../Model/Application");
jest.mock("../Model/User");
jest.mock("../Model/SupplierOrder");

describe("ApplicationService", () => {
  let applicationService: ApplicationService;
  let mockApplication: jest.Mocked<typeof Application>;
  let mockUser: jest.Mocked<typeof User>;
  let mockSupplierOrder: jest.Mocked<typeof SupplierOrder>;

  beforeEach(() => {
    jest.clearAllMocks();

    applicationService = new ApplicationService();

    mockApplication = Application as jest.Mocked<typeof Application>;
    mockUser = User as jest.Mocked<typeof User>;
    mockSupplierOrder = SupplierOrder as jest.Mocked<typeof SupplierOrder>;
  });

  describe("createApplication", () => {
    it("should create an application successfully", async () => {
      const applicationData = {
        userId: 1,
        businessEmail: "test@email.com",
        businessPhone: "123456789",
        documentsSubmitted: [
          {
            filename: "doc1.pdf",
            path: "/uploads/doc1.pdf",
          },
        ],
        supplierComment: "Test comment",
        name: "Test Supplier",
        location: "Lisbon",
        freguesia: "Lisbon Parish",
        municipio: "Lisbon",
        status: "submitted" as const,
        farmerProducts: [
          {
            week: 1,
            products: [
              {
                productId: 1,
                quantity: 100,
                unit: "kg",
              },
            ],
          },
        ],
      };

      const createdApplication = {
        id: 1,
        ...applicationData,
        farmerProducts: [],
      };

      (mockApplication.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createdApplication);

      (mockApplication.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...applicationData,
      });

      const result = await applicationService.createApplication(applicationData);

      expect(mockApplication.findOne).toHaveBeenCalledWith({
        where: { userId: applicationData.userId },
      });
      expect(mockApplication.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should throw error if application already exists for user", async () => {
      const applicationData = {
        userId: 1,
        businessEmail: "test@email.com",
        businessPhone: "123456789",
        documentsSubmitted: [],
        name: "Test Supplier",
        location: "Lisbon",
        freguesia: "Lisbon Parish",
        municipio: "Lisbon",
        farmerProducts: [],
      };

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce({
        id: 1,
        userId: 1,
      });

      await expect(
        applicationService.createApplication(applicationData)
      ).rejects.toThrow("APPLICATION_ALREADY_EXISTS");
    });

    it("should create application with default status", async () => {
      const applicationData = {
        userId: 2,
        businessEmail: "supplier@email.com",
        businessPhone: "987654321",
        documentsSubmitted: [],
        name: "Another Supplier",
        location: "Porto",
        freguesia: "Porto Parish",
        municipio: "Porto",
        farmerProducts: [],
      };

      const createdApplication = {
        id: 2,
        ...applicationData,
        status: "submitted",
        farmerProducts: [],
      };

      (mockApplication.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createdApplication);

      (mockApplication.create as jest.Mock).mockResolvedValueOnce(createdApplication);

      const result = await applicationService.createApplication(applicationData);

      expect(result).toBeDefined();
      expect(mockApplication.create).toHaveBeenCalled();
    });
  });

  describe("getApplicationByUser", () => {
    it("should return application for a valid user", async () => {
      const userId = 1;
      const mockAppData = {
        id: 1,
        userId,
        businessEmail: "test@email.com",
        businessPhone: "123456789",
        status: "submitted",
        farmerProducts: [],
      };

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(mockAppData);

      const result = await applicationService.getApplicationByUser(userId);

      expect(mockApplication.findOne).toHaveBeenCalledWith({
        where: { userId },
        include: [{ association: "farmerProducts" }],
      });
      expect(result).toEqual(mockAppData);
    });

    it("should throw error if application not found", async () => {
      const userId = 999;

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        applicationService.getApplicationByUser(userId)
      ).rejects.toThrow("APPLICATION_NOT_FOUND");
    });
  });

  describe("getFilePathByApplicationIdAndFileName", () => {
    it("should return correct file path for valid application and filename", async () => {
      const applicationId = 1;
      const filename = "document.pdf";
      const filePath = "/uploads/document.pdf";

      const mockAppData = {
        id: applicationId,
        documentsSubmitted: [
          {
            filename,
            path: filePath,
          },
        ],
      };

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(mockAppData);

      const result = await applicationService.getFilePathByApplicationIdAndFileName(
        applicationId,
        filename
      );

      expect(result).toBe(path.resolve(filePath));
    });

    it("should throw error if application not found", async () => {
      const applicationId = 999;
      const filename = "document.pdf";

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        applicationService.getFilePathByApplicationIdAndFileName(
          applicationId,
          filename
        )
      ).rejects.toThrow("APPLICATION_NOT_FOUND");
    });

    it("should throw error if document not found", async () => {
      const applicationId = 1;
      const filename = "nonexistent.pdf";

      const mockAppData = {
        id: applicationId,
        documentsSubmitted: [
          {
            filename: "other.pdf",
            path: "/uploads/other.pdf",
          },
        ],
      };

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(mockAppData);

      await expect(
        applicationService.getFilePathByApplicationIdAndFileName(
          applicationId,
          filename
        )
      ).rejects.toThrow("DOCUMENT_NOT_FOUND");
    });
  });

  describe("listApplications", () => {
    it("should return all applications with farmer products", async () => {
      const mockApplications = [
        {
          id: 1,
          userId: 1,
          status: "submitted",
          farmerProducts: [
            {
              id: 1,
              product: { id: 1, name: "Apple" },
            },
          ],
        },
        {
          id: 2,
          userId: 2,
          status: "approved",
          farmerProducts: [],
        },
      ];

      (mockApplication.findAll as jest.Mock).mockResolvedValueOnce(
        mockApplications
      );

      const result = await applicationService.listApplications();

      expect(mockApplication.findAll).toHaveBeenCalledWith({
        include: [
          {
            association: "farmerProducts",
            include: [{ association: "product" }],
          },
        ],
      });
      expect(result).toEqual(mockApplications);
    });

    it("should return empty array when no applications exist", async () => {
      (mockApplication.findAll as jest.Mock).mockResolvedValueOnce([]);

      const result = await applicationService.listApplications();

      expect(result).toEqual([]);
    });
  });

  describe("updateApplication", () => {
    it("should update application successfully", async () => {
      const applicationId = 1;
      const updateData = {
        businessEmail: "newemail@email.com",
        businessPhone: "987654321",
      };

      const mockApp = {
        id: applicationId,
        userId: 1,
        businessEmail: "oldemail@email.com",
        businessPhone: "123456789",
        update: jest.fn().mockResolvedValueOnce(true),
      };

      const updatedApp = {
        ...mockApp,
        ...updateData,
      };

      (mockApplication.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockApp)
        .mockResolvedValueOnce(null);

      (mockApplication.findOne as jest.Mock).mockResolvedValueOnce(updatedApp);

      const result = await applicationService.updateApplication(
        applicationId,
        updateData
      );

      expect(mockApplication.findByPk).toHaveBeenCalledWith(applicationId);
      expect(mockApp.update).toHaveBeenCalledWith(updateData);
      expect(result).toBeDefined();
    });

    it("should throw error if application not found", async () => {
      const applicationId = 999;

      (mockApplication.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        applicationService.updateApplication(applicationId, {})
      ).rejects.toThrow("APPLICATION_NOT_FOUND");
    });
  });
});
