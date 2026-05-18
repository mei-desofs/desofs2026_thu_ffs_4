import { generateNeededProductsFromPublishedMenus } from "../utils/generateNeededProducts";
import { Menu } from "../Model/Menu";
import { Meal } from "../Model/Meal";
import { Dish } from "../Model/Dish";
import { Recipe } from "../Model/Recipe";
import { Ingredient } from "../Model/Ingredient";
import { AverageReservation } from "../Model/AverageReservation";
import { Stock } from "../Model/Stock";
import { Batch } from "../Model/Batch";
import { NeededProduct } from "../Model/NeededProduct";
import { Unit } from "../Model/Unit";
import { Op } from "sequelize";

jest.mock("../Model/Menu");
jest.mock("../Model/Meal");
jest.mock("../Model/Dish");
jest.mock("../Model/Recipe");
jest.mock("../Model/Ingredient");
jest.mock("../Model/AverageReservation");
jest.mock("../Model/Stock");
jest.mock("../Model/Batch");
jest.mock("../Model/NeededProduct");
jest.mock("../Model/Unit");

describe("generateNeededProductsFromPublishedMenus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle no published menus", async () => {
    (Menu.findAll as jest.Mock).mockResolvedValue([]);

    await generateNeededProductsFromPublishedMenus();

    expect(Menu.findAll).toHaveBeenCalledWith({
      where: { status: { [Op.or]: ["published", "aproved"] } },
    });
  });

  it("should handle menus with no meals", async () => {
    const mockMenu = {
      id: 1,
      meals: [1, 2],
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([]);

    await generateNeededProductsFromPublishedMenus();

    expect(Meal.findAll).toHaveBeenCalled();
  });

  it("should skip meals with no dish", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date(),
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(null);

    await generateNeededProductsFromPublishedMenus();

    expect(Dish.findByPk).toHaveBeenCalledWith(1);
  });

  it("should skip dishes with no recipe", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date(),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(null);

    await generateNeededProductsFromPublishedMenus();

    expect(Recipe.findByPk).toHaveBeenCalledWith(1);
  });

  it("should skip recipes with no ingredients", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date(),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: null,
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);

    await generateNeededProductsFromPublishedMenus();

    expect(NeededProduct.create).not.toHaveBeenCalled();
  });

  it("should skip when no average reservation found", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date(),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: [1],
    };
    const mockIngredient = {
      id: 1,
      quantity: 100,
      unitId: 1,
      productId: 1,
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);
    (Ingredient.findAll as jest.Mock).mockResolvedValue([mockIngredient]);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(null);

    await generateNeededProductsFromPublishedMenus();

    expect(NeededProduct.create).not.toHaveBeenCalled();
  });

  it("should skip ingredient without unit", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date(),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: [1],
    };
    const mockIngredient = {
      id: 1,
      quantity: 100,
      unitId: 1,
      productId: 1,
    };
    const mockAvgReservation = {
      avgReservations: 50,
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);
    (Ingredient.findAll as jest.Mock).mockResolvedValue([mockIngredient]);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(
      mockAvgReservation,
    );
    (Unit.findByPk as jest.Mock).mockResolvedValue(null);

    await generateNeededProductsFromPublishedMenus();

    expect(NeededProduct.create).not.toHaveBeenCalled();
  });

  it("should create new NeededProduct when quantity is positive and none exists", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date("2025-02-01"),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: [1],
    };
    const mockIngredient = {
      id: 1,
      quantity: 100,
      unitId: 1,
      productId: 1,
    };
    const mockUnit = {
      id: 1,
      name: "g",
    };
    const mockAvgReservation = {
      avgReservations: 50,
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);
    (Ingredient.findAll as jest.Mock).mockResolvedValue([mockIngredient]);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(
      mockAvgReservation,
    );
    (Unit.findByPk as jest.Mock).mockResolvedValue(mockUnit);
    (Stock.findAll as jest.Mock).mockResolvedValue([]);
    (NeededProduct.findOne as jest.Mock).mockResolvedValue(null);

    await generateNeededProductsFromPublishedMenus();

    expect(NeededProduct.create).toHaveBeenCalledWith(
      expect.objectContaining({
        date: mockMeal.date,
        productId: 1,
        mealId: 1,
        unit: "g",
        quantity: 5000,
      }),
    );
  });

  it("should update existing NeededProduct if quantity is larger", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date("2025-02-01"),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: [1],
    };
    const mockIngredient = {
      id: 1,
      quantity: 100,
      unitId: 1,
      productId: 1,
    };
    const mockUnit = {
      id: 1,
      name: "g",
    };
    const mockAvgReservation = {
      avgReservations: 50,
    };
    const mockExisting = {
      quantity: 3000,
      save: jest.fn(),
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);
    (Ingredient.findAll as jest.Mock).mockResolvedValue([mockIngredient]);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(
      mockAvgReservation,
    );
    (Unit.findByPk as jest.Mock).mockResolvedValue(mockUnit);
    (Stock.findAll as jest.Mock).mockResolvedValue([]);
    (NeededProduct.findOne as jest.Mock).mockResolvedValue(mockExisting);

    await generateNeededProductsFromPublishedMenus();

    expect(mockExisting.quantity).toBe(5000);
    expect(mockExisting.save).toHaveBeenCalled();
  });

  it("should not create NeededProduct when quantity to order is zero or negative", async () => {
    const mockMenu = {
      id: 1,
      meals: [1],
      canteenId: 1,
    };
    const mockMeal = {
      id: 1,
      dishId: 1,
      mealTypeId: 1,
      date: new Date("2025-02-01"),
    };
    const mockDish = {
      id: 1,
      recipeId: 1,
    };
    const mockRecipe = {
      id: 1,
      ingredients: [1],
    };
    const mockIngredient = {
      id: 1,
      quantity: 100,
      unitId: 1,
      productId: 1,
    };
    const mockUnit = {
      id: 1,
      name: "g",
    };
    const mockAvgReservation = {
      avgReservations: 50,
    };
    const mockBatch = {
      quantity: 6000,
      unitId: 1,
    };
    const mockStock = {
      batches: [1],
    };

    (Menu.findAll as jest.Mock).mockResolvedValue([mockMenu]);
    (Meal.findAll as jest.Mock).mockResolvedValue([mockMeal]);
    (Dish.findByPk as jest.Mock).mockResolvedValue(mockDish);
    (Recipe.findByPk as jest.Mock).mockResolvedValue(mockRecipe);
    (Ingredient.findAll as jest.Mock).mockResolvedValue([mockIngredient]);
    (AverageReservation.findOne as jest.Mock).mockResolvedValue(
      mockAvgReservation,
    );
    (Unit.findByPk as jest.Mock).mockResolvedValue(mockUnit);
    (Stock.findAll as jest.Mock).mockResolvedValue([mockStock]);
    (Batch.findAll as jest.Mock).mockResolvedValue([mockBatch]);

    await generateNeededProductsFromPublishedMenus();

    expect(NeededProduct.create).not.toHaveBeenCalled();
  });
});
