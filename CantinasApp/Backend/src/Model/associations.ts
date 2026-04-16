import { User } from "./User";
import { Application } from "./Application";
import { Product } from "./Product";
import { ProductType } from "./ProductType";
import { FarmerProduct } from "./FarmerProducts";
import { Reservation } from "./Reservation";
import { Meal } from "./Meal";
import { Dish } from "./Dish";
import { DishType } from "./DishType";
import { WasteReport } from "./WasteReport";
import { Canteen } from "./Canteen";
import { Refeitorio } from "./Refeitorio";
import { Institution } from "./Institution";
import { CanteenRefeitorio } from "./CanteenRefeitorio";
import { MenuType } from "./MenuType";
import { Menu } from "./Menu";
import { ReservationQuantitiesCanteen } from "./ReservationQuantitiesCanteen";
import { Ingredient } from "./Ingredient";
import { Unit } from "./Unit";
import { Order } from "./Order";

// -------------------------
// Product ↔ ProductType
// -------------------------
Product.belongsTo(ProductType, { foreignKey: "typeId", as: "type" });
ProductType.hasMany(Product, { foreignKey: "typeId", as: "products" });

// -------------------------
// Application ↔ User
// -------------------------
Application.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Application, { foreignKey: "userId", as: "applications" });

// -------------------------
// FarmerProduct ↔ Application
// -------------------------
FarmerProduct.belongsTo(Application, { foreignKey: "applicationId", as: "application" });
Application.hasMany(FarmerProduct, { foreignKey: "applicationId", as: "farmerProducts" });

// -------------------------
// FarmerProduct ↔ User
// -------------------------
FarmerProduct.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(FarmerProduct, { foreignKey: "userId", as: "farmerProductsByUser" });

// -------------------------
// FarmerProduct ↔ Product
// -------------------------
FarmerProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(FarmerProduct, { foreignKey: "productId", as: "farmerApplications" });

// -------------------------
// Reservation ↔ Meal
// -------------------------
Reservation.belongsTo(Meal, { foreignKey: "mealId", as: "meal" });
Meal.hasMany(Reservation, { foreignKey: "mealId", as: "reservations" });

// -------------------------
// Reservation ↔ User
// -------------------------
Reservation.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Reservation, { foreignKey: "userId", as: "reservations" });

// -------------------------
// Meal ↔ Dish
// -------------------------
Meal.belongsTo(Dish, { foreignKey: "dishId", as: "dish" });
Dish.hasMany(Meal, { foreignKey: "dishId", as: "meals" });

// -------------------------
// Dish ↔ DishType
// -------------------------
Dish.belongsTo(DishType, { foreignKey: "dishTypeId", as: "dishType" });
DishType.hasMany(Dish, { foreignKey: "dishTypeId", as: "dishes" });

// -------------------------
// WasteReport ↔ Meal
// -------------------------
WasteReport.belongsTo(Meal, { foreignKey: "mealId", as: "meal" });
Meal.hasMany(WasteReport, { foreignKey: "mealId", as: "wasteReports" });

// -------------------------
// WasteReport ↔ User (reportedBy)
// -------------------------
WasteReport.belongsTo(User, { foreignKey: "reportedBy", as: "reporter" });
User.hasMany(WasteReport, { foreignKey: "reportedBy", as: "wasteReports" });

// -------------------------
// WasteReport ↔ Reservation (opcional)
// -------------------------
WasteReport.belongsTo(Reservation, { foreignKey: "reservationId", as: "reservation" });
Reservation.hasMany(WasteReport, { foreignKey: "reservationId", as: "wasteReports" });

// -------------------------
// Institution ↔ Canteen
// -------------------------
Canteen.belongsTo(Institution, { foreignKey: "institutionId", as: "institution" });
Institution.hasMany(Canteen, { foreignKey: "institutionId", as: "canteens" });

// -------------------------
// Institution ↔ Refeitório
// -------------------------
Refeitorio.belongsTo(Institution, { foreignKey: "institutionId", as: "institution" });
Institution.hasMany(Refeitorio, { foreignKey: "institutionId", as: "refeitorios" });

// -------------------------
// Canteen ↔ Refeitório (Many-to-Many via CanteenRefeitorio)
// -------------------------
Canteen.belongsToMany(Refeitorio, {
  through: CanteenRefeitorio,
  foreignKey: "canteenId",
  otherKey: "refeitorioId",
  as: "refeitorios",
});
Refeitorio.belongsToMany(Canteen, {
  through: CanteenRefeitorio,
  foreignKey: "refeitorioId",
  otherKey: "canteenId",
  as: "canteens",
});

// -------------------------
// Meal ↔ Canteen
// -------------------------
Meal.belongsTo(Canteen, { foreignKey: "canteenId", as: "canteen" });
Canteen.hasMany(Meal, { foreignKey: "canteenId", as: "meals" });

// -------------------------
// Meal ↔ Refeitório
// -------------------------
Meal.belongsTo(Refeitorio, { foreignKey: "refeitorioId", as: "refeitorio" });
Refeitorio.hasMany(Meal, { foreignKey: "refeitorioId", as: "meals" });

// -------------------------
// Reservation ↔ Refeitório
// -------------------------
Reservation.belongsTo(Refeitorio, { foreignKey: "refeitorioId", as: "refeitorio" });
Refeitorio.hasMany(Reservation, { foreignKey: "refeitorioId", as: "reservations" });

// -------------------------
// WasteReport ↔ Refeitório
// -------------------------
WasteReport.belongsTo(Refeitorio, { foreignKey: "refeitorioId", as: "refeitorio" });
Refeitorio.hasMany(WasteReport, { foreignKey: "refeitorioId", as: "wasteReports" });

// -------------------------
// User ↔ Refeitório (para RefeitorioManager)
// -------------------------
User.belongsTo(Refeitorio, { foreignKey: "refeitorioId", as: "refeitorio" });
Refeitorio.hasMany(User, { foreignKey: "refeitorioId", as: "managers" });

// -------------------------
// User ↔ Canteen (para CanteenManager)
// User ↔ Refeitório (para RefectoryManager e RefectoryStaff)
// -------------------------
User.belongsTo(Canteen, { foreignKey: "canteenId", as: "canteen" });
Canteen.hasMany(User, { foreignKey: "canteenId", as: "staff" });

// -------------------------
// Institution ↔ MenuType
// -------------------------
Institution.belongsTo(MenuType, { foreignKey: "idmenutype", as: "menuType" });
MenuType.hasMany(Institution, { foreignKey: "idmenutype", as: "institutions" });

// -------------------------
// Canteen ↔ MenuType
// -------------------------
Canteen.belongsTo(MenuType, { foreignKey: "idmenutype", as: "menuType" });
MenuType.hasMany(Canteen, { foreignKey: "idmenutype", as: "canteens" });
// -------------------------
// Menu ↔ Canteen
// -------------------------
Menu.belongsTo(Canteen, { foreignKey: "canteenId", as: "canteen" });
Canteen.hasMany(Menu, { foreignKey: "canteenId", as: "menus" });

// -------------------------
// ReservationQuantitiesCanteen ↔ Canteen
// -------------------------
ReservationQuantitiesCanteen.belongsTo(Canteen, { foreignKey: "canteenId", as: "canteen" });
Canteen.hasMany(ReservationQuantitiesCanteen, { foreignKey: "canteenId", as: "reservationQuantities" });

// -------------------------
// ReservationQuantitiesCanteen ↔ Dish
// -------------------------
ReservationQuantitiesCanteen.belongsTo(Dish, { foreignKey: "dishId", as: "dish" });
Dish.hasMany(ReservationQuantitiesCanteen, { foreignKey: "dishId", as: "reservationQuantities" });

// -------------------------
// ReservationQuantitiesCanteen ↔ Refeitório
// -------------------------
ReservationQuantitiesCanteen.belongsTo(Refeitorio, { foreignKey: "refeitorioId", as: "refeitorio" });
Refeitorio.hasMany(ReservationQuantitiesCanteen, { foreignKey: "refeitorioId", as: "reservationQuantities" });

// -------------------------
// Ingredient ↔ Product
// -------------------------
Ingredient.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Ingredient, { foreignKey: "productId", as: "ingredients" });

// -------------------------
// Ingredient ↔ Unit
// -------------------------
Ingredient.belongsTo(Unit, { foreignKey: "unitId", as: "unit" });
Unit.hasMany(Ingredient, { foreignKey: "unitId", as: "ingredients" });

// -------------------------
// Order ↔ Canteen
// -------------------------
Order.belongsTo(Canteen, { foreignKey: "canteenId", as: "canteen" });
Canteen.hasMany(Order, { foreignKey: "canteenId", as: "orders" });

// -------------------------
// Order ↔ Product
// -------------------------
Order.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Order, { foreignKey: "productId", as: "orders" });

