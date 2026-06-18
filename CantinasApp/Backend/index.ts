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
import bootstrap from "./src/Bootstrap";
import { startMarkUnconsumedReservationsJob } from "./src/Jobs/markUnconsumedReservations";
import { startWeeklyMenuPlanningJob } from "./src/Jobs/weeklyMenuPlanning";
import path from "path";
import { Menu } from "./src/Model/Menu";
import { Order } from "./src/Model/Order";
import { NeededProduct } from "./src/Model/NeededProduct";
import { Notification } from "./src/Model/Notification";
import { AverageReservation } from "./src/Model/AverageReservation";
import requestLogger from "./src/middlewares/requestLogger";
import { allowedMethodsMiddleware } from "./src/middlewares/allowedMethods";
import { headerSanitizer } from "./src/middlewares/headerSanitizer";
import { urlLengthLimit } from "./src/middlewares/urlLength";
import hpp from "hpp";
import logger from "./src/utils/logger";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

app.set("trust proxy", true);
app.use(hpp());
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
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
  }),
);

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(requestLogger);
app.use(
  express.json({
    limit: "1mb",
    type: "application/json",
  }),
);
app.use(headerSanitizer);
app.use(urlLengthLimit);
app.use(allowedMethodsMiddleware);
// API Routes - all under /api prefix
app.use("/api/users", userRoutes);
app.use("/api/auxiliar", auxiliarRoutes);
app.use("/api/products", productRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/farmer-products", FarmerProductRoutes);
app.use("/api/batches", BatchRoutes);
app.use("/api/stocks", StockRoutes);
app.use("/api/ingredients", IngredientRoutes);
app.use("/api/recipes", RecipeRoutes);
app.use("/api/dishes", DishRoutes);
app.use("/api/meals", MealRoutes);
app.use("/api/menus", MenuRoutes);
app.use("/api/statistics", StatisticsRoutes);
app.use("/api/reservations", ReservationRoutes);
app.use("/api/performance", PerformanceRoutes);
app.use("/api/waste-reports", WasteReportRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/needed-products", neededProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/parishes", ParishRoutes);
app.use("/api/institutions", InstitutionRoutes);
app.use("/api/refeitorios", RefeitorioRoutes);
app.use("/api/canteens", CanteenRoutes);
app.use("/api/producer-statistics", ProducerStatisticsRoutes);
app.get("/", (req, res) => {
  res.send("Backend TypeScript a funcionar!");
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connected to the database successfully");

    await sequelize.sync({ alter: false });
    logger.info("Tables synced");

    // Run bootstrap seeding/initialization
    await bootstrap();

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
