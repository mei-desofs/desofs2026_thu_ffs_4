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
  test("require all model modules", async () => {
    for (const name of modelFiles) {
      const mod = await import(`../Model/${name}`);
      expect(mod).toBeDefined();
    }
  });
});
