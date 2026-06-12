import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../middlewares/errorHandler";
import { safeFilename } from "../utils/fileUtils";
import path from "path";

jest.mock("../utils/logger", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../Model/Reservation");
jest.mock("../Model/Meal");
jest.mock("../Model/User");
jest.mock("../Model/Refeitorio");

describe("errorHandler middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { path: "/test", method: "GET" };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should return 500 with generic message and not leak error details", () => {
    const err = new Error("Database password is wrong123");

    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
    expect(JSON.stringify(jsonCall)).not.toContain("password");
    expect(JSON.stringify(jsonCall)).not.toContain("Database");
  });

  it("should not expose stack trace in response", () => {
    const err = new Error("Internal details with stack");

    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);

    const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall).not.toHaveProperty("stack");
  });
});

describe("safeFilename", () => {
  it("should return a UUID-based name ignoring the original filename", () => {
    const result = safeFilename("../../etc/passwd");
    expect(result).not.toContain("..");
    expect(result).not.toContain("/");
    expect(result).not.toContain("passwd");
  });

  it("should preserve the file extension", () => {
    const result = safeFilename("document.pdf");
    expect(result.endsWith(".pdf")).toBe(true);
  });

  it("should generate unique names on each call", () => {
    const a = safeFilename("file.pdf");
    const b = safeFilename("file.pdf");
    expect(a).not.toBe(b);
  });
});

describe("path traversal protection", () => {
  it("should detect when a resolved path escapes the uploads directory", () => {
    const uploadsDir = path.resolve("uploads");
    const maliciousFilename = "../etc/passwd";
    const resolved = path.resolve(uploadsDir, maliciousFilename);
    const isContained = resolved.startsWith(uploadsDir + path.sep);
    expect(isContained).toBe(false);
  });

  it("should accept a safe path within the uploads directory", () => {
    const uploadsDir = path.resolve("uploads");
    const safeFile = "abc123.pdf";
    const resolved = path.resolve(uploadsDir, safeFile);
    const isContained = resolved.startsWith(uploadsDir + path.sep);
    expect(isContained).toBe(true);
  });
});

describe("ReservationService duplicate prevention", () => {
  const { Reservation } = jest.requireMock("../Model/Reservation");
  const { Meal } = jest.requireMock("../Model/Meal");
  const { User } = jest.requireMock("../Model/User");
  const { Refeitorio } = jest.requireMock("../Model/Refeitorio");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw DUPLICATE_RESERVATION when an active reservation already exists", async () => {
    Meal.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    Refeitorio.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    Reservation.findOne = jest.fn().mockResolvedValue({ id: 99 });
    Reservation.create = jest.fn();

    const { ReservationService } = await import("../Service/ReservationService");
    const service = new ReservationService();

    await expect(
      service.createReservation({
        status: "active",
        reservationDate: new Date(),
        quantity: 1,
        mealId: 1,
        userId: 1,
        refeitorioId: 1,
      })
    ).rejects.toThrow("DUPLICATE_RESERVATION");

    expect(Reservation.create).not.toHaveBeenCalled();
  });

  it("should allow creating a reservation when no duplicate exists", async () => {
    Meal.findByPk = jest.fn().mockResolvedValue({ id: 1, canteenId: 1 });
    User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    Refeitorio.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    Reservation.findOne = jest.fn().mockResolvedValue(null);
    Reservation.create = jest.fn().mockResolvedValue({ id: 1 });
    Reservation.findOrCreate = jest.fn().mockResolvedValue([{ quantity: 0, save: jest.fn() }, true]);

    const { ReservationService } = await import("../Service/ReservationService");
    const service = new ReservationService();

    await service.createReservation({
      status: "active",
      reservationDate: new Date(),
      quantity: 1,
      mealId: 1,
      userId: 1,
      refeitorioId: 1,
    });

    expect(Reservation.create).toHaveBeenCalled();
  });
});
