import { generateOrdersFromNeededProducts } from "../utils/generateOrdersFromNeededProducts";
import { NeededProduct } from "../Model/NeededProduct";
import { SupplierOrder } from "../Model/SupplierOrder";
import { FarmerProduct } from "../Model/FarmerProducts";
import { Order } from "../Model/Order";
import { Notification } from "../Model/Notification";
import { User } from "../Model/User";
import { Product } from "../Model/Product";

jest.mock("../Model/NeededProduct");
jest.mock("../Model/SupplierOrder");
jest.mock("../Model/FarmerProducts");
jest.mock("../Model/Order");
jest.mock("../Model/Notification");
jest.mock("../Model/User");
jest.mock("../Model/Product");
jest.mock("../utils/date");

describe("generateOrdersFromNeededProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return early if no needed products exist", async () => {
    (NeededProduct.findAll as jest.Mock).mockResolvedValue([]);

    await generateOrdersFromNeededProducts();

    expect(NeededProduct.findAll).toHaveBeenCalled();
    expect(User.findAll).not.toHaveBeenCalled();
  });

  it("should filter out suppliers with quarantine status", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      save: jest.fn()
    };
    const mockSupplierOrder1 = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockSupplierOrder2 = {
      id: 2,
      supplierId: 2,
      position: 2
    };
    const mockActiveUser = {
      id: 1,
      status: "active"
    };
    const mockQuarantineUser = {
      id: 2,
      status: "quarantine"
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([
      mockSupplierOrder1,
      mockSupplierOrder2
    ]);
    (User.findAll as jest.Mock).mockResolvedValue([]);
    (User.findByPk as jest.Mock)
      .mockResolvedValueOnce(mockActiveUser)
      .mockResolvedValueOnce(mockQuarantineUser);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await generateOrdersFromNeededProducts();

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(User.findByPk).toHaveBeenCalledWith(2);
  });

  it("should create order for available farmer product", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1,
      save: jest.fn()
    };
    const mockSupplierOrder = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockUser = {
      id: 1,
      status: "active"
    };
    const mockFarmerProduct = {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2000,
      unit: "g",
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([mockSupplierOrder]);
    (User.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([mockFarmerProduct]);
    (Order.findOne as jest.Mock).mockResolvedValue(null);
    (Order.create as jest.Mock).mockResolvedValue({});
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await generateOrdersFromNeededProducts();

    expect(Order.create).toHaveBeenCalled();
  });

  it("should update existing order instead of creating new one", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1,
      save: jest.fn()
    };
    const mockSupplierOrder = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockUser = {
      id: 1,
      status: "active"
    };
    const mockFarmerProduct = {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2000,
      unit: "g",
      save: jest.fn()
    };
    const mockExistingOrder = {
      id: 1,
      quantity: 500,
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([mockSupplierOrder]);
    (User.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([mockFarmerProduct]);
    (Order.findOne as jest.Mock).mockResolvedValue(mockExistingOrder);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await generateOrdersFromNeededProducts();

    expect(mockExistingOrder.quantity).toBeGreaterThanOrEqual(500);
    expect(mockExistingOrder.save).toHaveBeenCalled();
  });

  it("should skip farmer with zero available quantity", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1
    };
    const mockSupplierOrder = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockUser = {
      id: 1,
      status: "active"
    };
    const mockFarmerProduct = {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 0,
      unit: "g",
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([mockSupplierOrder]);
    (User.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([mockFarmerProduct]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await generateOrdersFromNeededProducts();

    expect(Order.create).not.toHaveBeenCalled();
  });

  it("should not create order for farmer if product not found", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1
    };
    const mockSupplierOrder = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockUser = {
      id: 1,
      status: "active"
    };
    const mockFarmerProduct = {
      id: 1,
      userId: 2,
      productId: 1,
      quantity: 2000,
      unit: "g",
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([mockSupplierOrder]);
    (User.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([mockFarmerProduct]);
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    await generateOrdersFromNeededProducts();

    expect(Order.create).not.toHaveBeenCalled();
  });

  it("should handle multiple needed products", async () => {
    const mockNeededProduct1 = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1,
      save: jest.fn()
    };
    const mockNeededProduct2 = {
      id: 2,
      date: new Date(),
      status: "needed",
      quantity: 500,
      unit: "g",
      productId: 2,
      mealId: 2,
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([
      mockNeededProduct1,
      mockNeededProduct2
    ]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([]);
    (User.findAll as jest.Mock).mockResolvedValue([]);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product" });

    await generateOrdersFromNeededProducts();

    expect(NeededProduct.findAll).toHaveBeenCalled();
  });

  it("should send success notification when orders are created", async () => {
    const mockNeededProduct = {
      id: 1,
      date: new Date(),
      status: "needed",
      quantity: 1000,
      unit: "g",
      productId: 1,
      mealId: 1,
      save: jest.fn()
    };
    const mockSupplierOrder = {
      id: 1,
      supplierId: 1,
      position: 1
    };
    const mockStockManager = {
      id: 1,
      status: "active"
    };
    const mockFarmerProduct = {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2000,
      unit: "g",
      save: jest.fn()
    };

    (NeededProduct.findAll as jest.Mock).mockResolvedValue([mockNeededProduct]);
    (SupplierOrder.findAll as jest.Mock).mockResolvedValue([mockSupplierOrder]);
    (User.findAll as jest.Mock).mockResolvedValue([mockStockManager]);
    (User.findByPk as jest.Mock).mockResolvedValue(mockStockManager);
    (FarmerProduct.findAll as jest.Mock).mockResolvedValue([mockFarmerProduct]);
    (Order.findOne as jest.Mock).mockResolvedValue(null);
    (Order.create as jest.Mock).mockResolvedValue({});
    (Notification.create as jest.Mock).mockResolvedValue({});
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await generateOrdersFromNeededProducts();

    expect(Notification.create).toHaveBeenCalled();
  });
});
