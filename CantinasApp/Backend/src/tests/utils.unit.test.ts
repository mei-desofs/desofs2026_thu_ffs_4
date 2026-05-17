import { addDays, getWeekFromDate } from "../utils/date";
import { convertQuantity } from "../utils/unitConversion";

describe("utils", () => {
  test("date utilities behave", () => {
    const d = new Date("2020-01-01T00:00:00.000Z");
    const d2 = addDays(d, 2);
    expect(d2.getUTCDate()).toBe(3);
    const w = getWeekFromDate(d2);
    expect(typeof w).toBe("number");
  });

  test("getWeekRange returns expected start and end", () => {
    const { start, end } = (require("../utils/date") as any).getWeekRange(1);
    expect(start instanceof Date).toBe(true);
    expect(end instanceof Date).toBe(true);
    // start should be the defined START_DATE in the module (2025-01-01)
    expect(start.getFullYear()).toBe(2025);
  });

  test("unit conversion returns number", () => {
    const v = convertQuantity(100, "g", "kg");
    expect(typeof v).toBe("number");
  });

  test("unit conversions cover branches", () => {
    expect(convertQuantity(1, "kg", "g")).toBe(1000);
    expect(convertQuantity(1000, "g", "kg")).toBe(1);
    expect(convertQuantity(1, "l", "ml")).toBe(1000);
    expect(convertQuantity(1000, "ml", "l")).toBe(1);
    expect(() => convertQuantity(1, "x", "y")).toThrow();
  });
});
