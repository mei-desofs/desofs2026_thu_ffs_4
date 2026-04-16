import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sequelize } from "./src/Config/db"; 
import userRoutes from "./src/Routes/UserRoutes";
import auxiliarRoutes from "./src/Routes/AuxiliarRoutes";
import productRoutes from "./src/Routes/ProductRoutes";
import applicationRoutes from "./src/Routes/ApplicationRoutes";
import FarmerProductRoutes from "./src/Routes/FarmerProductRoutes";
import BatchRoutes from "./src/Routes/BatchRoutes";
import StockRoutes from "./src/Routes/StockRoutes";
import IngredientRoutes from "./src/Routes/IngredientRoutes";
import RecipeRoutes from "./src/Routes/RecipeRoutes";
import DishRoutes from "./src/Routes/DishRoutes";
import MealRoutes from "./src/Routes/MealRoutes";
import MenuRoutes from "./src/Routes/MenuRoutes";
import StatisticsRoutes from "./src/Routes/StatisticsRoutes";
import ReservationRoutes from "./src/Routes/ReservationRoutes";
import PerformanceRoutes from "./src/Routes/PerformanceRoutes";
import WasteReportRoutes from "./src/Routes/WasteReportRoutes";
import neededProductRoutes from "./src/Routes/NeededProductRoutes";
import orderRoutes from "./src/Routes/OrderRoutes";
import NotificationRoutes from "./src/Routes/NotificationRoutes";
import ParishRoutes from "./src/Routes/ParishRoute";
import InstitutionRoutes from "./src/Routes/InstitutionRoutes";
import RefeitorioRoutes from "./src/Routes/RefeitorioRoutes";
import CanteenRoutes from "./src/Routes/CanteenRoutes";
import ProducerStatisticsRoutes from "./src/Routes/ProducerStatisticsRoutes";
import "./src/Model/associations";
import bootstrap from "./src/Bootstrap";
import { startMarkUnconsumedReservationsJob } from "./src/Jobs/markUnconsumedReservations";
import { startWeeklyMenuPlanningJob } from "./src/Jobs/weeklyMenuPlanning";
import path from "path";
import { Menu } from "./src/Model/Menu";
import { Order } from "./src/Model/Order";
import { NeededProduct } from "./src/Model/NeededProduct";
import { Notification } from "./src/Model/Notification";
import { AverageReservation } from "./src/Model/AverageReservation";  

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS ---
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auxiliar", auxiliarRoutes);
app.use("/products", productRoutes);
app.use("/applications", applicationRoutes);
app.use("/farmer-products", FarmerProductRoutes);
app.use("/batches", BatchRoutes);
app.use("/stocks", StockRoutes);
app.use("/ingredients", IngredientRoutes);
app.use("/recipes", RecipeRoutes);
app.use("/dishes", DishRoutes);
app.use("/meals", MealRoutes);
app.use("/menus", MenuRoutes);
app.use("/statistics", StatisticsRoutes);
app.use("/reservations", ReservationRoutes);
app.use("/performance", PerformanceRoutes);
app.use("/waste-reports", WasteReportRoutes);
app.use("/notifications", NotificationRoutes);
app.use("/needed-products", neededProductRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/parishes", ParishRoutes);
app.use("/institutions", InstitutionRoutes);
app.use("/refeitorios", RefeitorioRoutes);
app.use("/canteens", CanteenRoutes);
app.use("/producer-statistics", ProducerStatisticsRoutes);
app.get("/", (req, res) => {
  res.send("Backend TypeScript + MySQL a funcionar!");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Ligado ao MySQL com sucesso!");
    
    await sequelize.sync({alter:false});
    console.log("✅ Tabelas sincronizadas!");

    // Executa o bootstrap antes de iniciar o servidor
    //await bootstrap();
    //console.log("✅ Bootstrap executado!");

    // Inicia os jobs agendados
    startMarkUnconsumedReservationsJob();

    startWeeklyMenuPlanningJob();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar:", error);
    process.exit(1);
  }
};

startServer();
