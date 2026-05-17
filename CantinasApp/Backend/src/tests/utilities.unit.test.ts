import { addDays, getWeekFromDate, getWeekRange } from "../utils/date";
import { convertQuantity } from "../utils/unitConversion";

describe("Date utilities", () => {
  describe("addDays", () => {
    it("should add positive number of days", () => {
      const date = new Date("2025-01-01T00:00:00.000Z");
      const result = addDays(date, 5);
      expect(result.getUTCDate()).toBe(6);
    });

    it("should subtract negative number of days", () => {
      const date = new Date("2025-01-15T00:00:00.000Z");
      const result = addDays(date, -5);
      expect(result.getUTCDate()).toBe(10);
    });

    it("should handle zero days", () => {
      const date = new Date("2025-01-10T00:00:00.000Z");
      const result = addDays(date, 0);
      expect(result.getUTCDate()).toBe(10);
    });

    it("should handle month boundaries when adding days", () => {
      const date = new Date("2025-01-28T00:00:00.000Z");
      const result = addDays(date, 5);
      expect(result.getUTCMonth()).toBe(1); // February
      expect(result.getUTCDate()).toBe(2);
    });

    it("should handle month boundaries when subtracting days", () => {
      const date = new Date("2025-02-02T00:00:00.000Z");
      const result = addDays(date, -3);
      expect(result.getUTCMonth()).toBe(0); // January
      expect(result.getUTCDate()).toBe(30);
    });

    it("should handle year boundaries", () => {
      const date = new Date("2024-12-31T00:00:00.000Z");
      const result = addDays(date, 1);
      expect(result.getUTCFullYear()).toBe(2025);
      expect(result.getUTCMonth()).toBe(0);
      expect(result.getUTCDate()).toBe(1);
    });
  });

  describe("getWeekFromDate", () => {
    it("should return a number for a valid date", () => {
      const date = new Date("2025-01-15T00:00:00.000Z");
      const week = getWeekFromDate(date);
      expect(typeof week).toBe("number");
      expect(week).toBeGreaterThan(0);
      expect(week).toBeLessThanOrEqual(53);
    });

    it("should return week 1 for start of year", () => {
      const date = new Date("2025-01-01T00:00:00.000Z");
      const week = getWeekFromDate(date);
      expect(week).toBe(1);
    });

    it("should return different weeks for dates in different weeks", () => {
      const date1 = new Date("2025-01-06T00:00:00.000Z");
      const date2 = new Date("2025-01-13T00:00:00.000Z");
      const week1 = getWeekFromDate(date1);
      const week2 = getWeekFromDate(date2);
      expect(week2).toBeGreaterThan(week1);
    });

    it("should return same week for dates within same week", () => {
      const date1 = new Date("2025-01-06T00:00:00.000Z"); // Monday
      const date2 = new Date("2025-01-07T00:00:00.000Z"); // Tuesday
      const week1 = getWeekFromDate(date1);
      const week2 = getWeekFromDate(date2);
      expect(week1).toBe(week2);
    });
  });

  describe("getWeekRange", () => {
    it("should return start and end dates for a week", () => {
      const result = getWeekRange(1);
      expect(result).toHaveProperty("start");
      expect(result).toHaveProperty("end");
      expect(result.start instanceof Date).toBe(true);
      expect(result.end instanceof Date).toBe(true);
    });

    it("should have end date after start date", () => {
      const result = getWeekRange(1);
      expect(result.end.getTime()).toBeGreaterThan(result.start.getTime());
    });

    it("should return consistent start date for week 1 (2025-01-01)", () => {
      const result = getWeekRange(1);
      expect(result.start.getFullYear()).toBe(2025);
      expect(result.start.getMonth()).toBe(0);
      expect(result.start.getDate()).toBe(1);
    });

    it("should return dates approximately 7 days apart", () => {
      const result = getWeekRange(1);
      const diffMs = result.end.getTime() - result.start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeLessThanOrEqual(8);
      expect(diffDays).toBeGreaterThanOrEqual(6);
    });

    it("should handle different week numbers", () => {
      const week1 = getWeekRange(1);
      const week2 = getWeekRange(2);
      expect(week2.start.getTime()).toBeGreaterThan(week1.end.getTime());
    });

    it("should handle week 52", () => {
      const result = getWeekRange(52);
      expect(result.start instanceof Date).toBe(true);
      expect(result.end instanceof Date).toBe(true);
    });
  });
});

describe("Unit conversion utilities", () => {
  describe("convertQuantity", () => {
    it("should return same quantity when units are the same", () => {
      expect(convertQuantity(100, "g", "g")).toBe(100);
      expect(convertQuantity(50, "kg", "kg")).toBe(50);
      expect(convertQuantity(1000, "ml", "ml")).toBe(1000);
    });

    it("should convert grams to kilograms", () => {
      expect(convertQuantity(1000, "g", "kg")).toBe(1);
      expect(convertQuantity(500, "g", "kg")).toBe(0.5);
      expect(convertQuantity(5000, "g", "kg")).toBe(5);
    });

    it("should convert kilograms to grams", () => {
      expect(convertQuantity(1, "kg", "g")).toBe(1000);
      expect(convertQuantity(2.5, "kg", "g")).toBe(2500);
    });

    it("should convert milliliters to liters", () => {
      expect(convertQuantity(1000, "ml", "l")).toBe(1);
      expect(convertQuantity(500, "ml", "l")).toBe(0.5);
      expect(convertQuantity(2500, "ml", "l")).toBe(2.5);
    });

    it("should convert liters to milliliters", () => {
      expect(convertQuantity(1, "l", "ml")).toBe(1000);
      expect(convertQuantity(2, "l", "ml")).toBe(2000);
      expect(convertQuantity(0.5, "l", "ml")).toBe(500);
    });

    it("should throw error for incompatible units", () => {
      expect(() => convertQuantity(100, "g", "l")).toThrow();
      expect(() => convertQuantity(100, "kg", "ml")).toThrow();
      expect(() => convertQuantity(100, "x", "y")).toThrow();
    });

    it("should handle decimal quantities", () => {
      expect(convertQuantity(1.5, "kg", "g")).toBe(1500);
      expect(convertQuantity(0.25, "l", "ml")).toBe(250);
    });

    it("should return quantity for unknown units (passthrough)", () => {
      expect(convertQuantity(100, "unit", "unit")).toBe(100);
    });
  });
});
