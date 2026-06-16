import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
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
import { startMarkUnconsumedReservationsJob } from "./src/Jobs/markUnconsumedReservations";
import { startWeeklyMenuPlanningJob } from "./src/Jobs/weeklyMenuPlanning";
import path from "path";
import { allowedMethodsMiddleware } from "./src/middlewares/allowedMethods";
import { headerSanitizer } from "./src/middlewares/headerSanitizer";
import { urlLengthLimit } from "./src/middlewares/urlLength";
import logger from "./src/utils/logger";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({
  limit: "1mb",
  type: "application/json"
}));
app.use(headerSanitizer);
app.use(urlLengthLimit);
app.use(allowedMethodsMiddleware);
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

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connected to MySQL successfully");

    await sequelize.sync({ alter: false });
    logger.info("Tables synced");

    startMarkUnconsumedReservationsJob();
    startWeeklyMenuPlanningJob();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ event: "startup_error", error });
    process.exit(1);
  }
};

startServer();
