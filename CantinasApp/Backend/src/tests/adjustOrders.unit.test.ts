import { adjustOrdersAfterReservations } from "../utils/adjustOrdersAfterReservations";
import { Order } from "../Model/Order";
import { Meal } from "../Model/Meal";
import { AverageReservation } from "../Model/AverageReservation";
import { Reservation } from "../Model/Reservation";
import { User } from "../Model/User";
import { Notification } from "../Model/Notification";
import { NeededProduct } from "../Model/NeededProduct";
import { Product } from "../Model/Product";

jest.mock("../Model/Order");
jest.mock("../Model/Meal");
jest.mock("../Model/AverageReservation");
jest.mock("../Model/Reservation");
jest.mock("../Model/User");
jest.mock("../Model/Notification");
jest.mock("../Model/NeededProduct");
jest.mock("../Model/Product");

describe("adjustOrdersAfterReservations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return early if no pending orders exist", async () => {
    (Order.findAll as jest.Mock).mockResolvedValue([]);

    await adjustOrdersAfterReservations();

    expect(Order.findAll).toHaveBeenCalledWith({
      where: { status: "pending" }
    });
    expect(User.findAll).not.toHaveBeenCalled();
  });

  it("should skip order if no associated NeededProduct", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(null);
    (User.findAll as jest.Mock).mockResolvedValue([]);

    await adjustOrdersAfterReservations();

    expect(mockOrder.save).not.toHaveBeenCalled();
  });

  it("should skip order if no associated Meal", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(null);
    (User.findAll as jest.Mock).mockResolvedValue([]);

    await adjustOrdersAfterReservations();

    expect(mockOrder.save).not.toHaveBeenCalled();
  });

  it("should skip order if meal is outside 0-4 days window (before)", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 10); // 10 days away
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (User.findAll as jest.Mock).mockResolvedValue([]);

    await adjustOrdersAfterReservations();

    expect(mockOrder.save).not.toHaveBeenCalled();
  });

  it("should skip order if no AverageReservation found", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // 2 days away
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(50);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(null);
    (User.findAll as jest.Mock).mockResolvedValue([]);

    await adjustOrdersAfterReservations();

    expect(mockOrder.save).not.toHaveBeenCalled();
  });

  it("should cancel order when adjusted quantity <= 0", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // 2 days away
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };
    const mockAvgReservation = {
      avgReservations: 100
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(0);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(mockAvgReservation);
    (User.findAll as jest.Mock).mockResolvedValue([]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await adjustOrdersAfterReservations();

    expect(mockOrder.quantity).toBe(0);
    expect(mockOrder.status).toBe("cancelled");
    expect(mockOrder.save).toHaveBeenCalled();
  });

  it("should confirm order and update quantity based on actual reservations", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // 2 days away
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };
    const mockAvgReservation = {
      avgReservations: 100
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(150);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(mockAvgReservation);
    (User.findAll as jest.Mock).mockResolvedValue([]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await adjustOrdersAfterReservations();

    expect(mockOrder.quantity).toBe(150);
    expect(mockOrder.status).toBe("confirmed");
    expect(mockOrder.save).toHaveBeenCalled();
  });

  it("should send deviation notification when deviation > 10%", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };
    const mockAvgReservation = {
      avgReservations: 100
    };
    const mockStockManager = {
      id: 1,
      role: "StockManager"
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(125); // 25% deviation
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(mockAvgReservation);
    (User.findAll as jest.Mock).mockResolvedValue([mockStockManager]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });
    (Notification.create as jest.Mock).mockResolvedValue({});

    await adjustOrdersAfterReservations();

    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        title: "Desvio significativo nas reservas"
      })
    );
  });

  it("should send success notification when any order is adjusted", async () => {
    const mockOrder = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };
    const mockAvgReservation = {
      avgReservations: 100
    };
    const mockStockManager = {
      id: 1,
      role: "StockManager"
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(120);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(mockAvgReservation);
    (User.findAll as jest.Mock).mockResolvedValue([mockStockManager]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });
    (Notification.create as jest.Mock).mockResolvedValue({});

    await adjustOrdersAfterReservations();

    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        title: "Encomendas ajustadas após reservas"
      })
    );
  });

  it("should handle multiple pending orders", async () => {
    const mockOrder1 = {
      id: 1,
      neededProductId: 1,
      productId: 1,
      quantity: 100,
      status: "pending",
      save: jest.fn()
    };
    const mockOrder2 = {
      id: 2,
      neededProductId: 2,
      productId: 2,
      quantity: 200,
      status: "pending",
      save: jest.fn()
    };

    const mockNeededProduct = {
      id: 1,
      mealId: 1,
      quantity: 100
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const mockMeal = {
      id: 1,
      date: tomorrow,
      dishId: 1,
      mealTypeId: 1,
      canteenId: 1
    };
    const mockAvgReservation = {
      avgReservations: 100
    };

    (Order.findAll as jest.Mock).mockResolvedValue([mockOrder1, mockOrder2]);
    (NeededProduct.findByPk as jest.Mock).mockResolvedValue(mockNeededProduct);
    (Meal.findByPk as jest.Mock).mockResolvedValue(mockMeal);
    (Reservation.sum as jest.Mock).mockResolvedValue(100);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(mockAvgReservation);
    (User.findAll as jest.Mock).mockResolvedValue([]);
    (Product.findByPk as jest.Mock).mockResolvedValue({ name: "Product A" });

    await adjustOrdersAfterReservations();

    expect(Order.findAll).toHaveBeenCalled();
  });
});
