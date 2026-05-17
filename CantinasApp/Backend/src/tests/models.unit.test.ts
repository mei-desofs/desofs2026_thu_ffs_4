const modelFiles = [
  "Application",
  "Allergen",
  "Batch",
  "AverageReservation",
  "Canteen",
  "CanteenRefeitorio",
  "Dish",
  "DishType",
  "FarmerProducts",
  "Information",
  "Meal",
  "MealType",
  "Institution",
  "Ingredient",
  "Menu",
  "MenuType",
  "NeededProduct",
  "Notification",
  "Parish",
  "Order",
  "NutritionType",
  "Product",
  "ProductType",
  "Recipe",
  "Refeitorio",
  "WasteReport",
  "User",
  "Unit",
  "SupplierOrder",
  "Stock",
  "ReservationQuantitiesCanteen",
  "Reservation",
  "associations",
];

describe("Model modules load", () => {
  test("require all model modules", () => {
    for (const name of modelFiles) {
      const mod = require(`../Model/${name}`);
      expect(mod).toBeDefined();
    }
  });
});
