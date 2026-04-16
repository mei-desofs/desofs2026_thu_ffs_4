import cron from "node-cron";
import { generateNeededProductsFromPublishedMenus } from "../utils/generateNeededProducts";
import { generateOrdersFromNeededProducts } from "../utils/generateOrdersFromNeededProducts";
import { adjustOrdersAfterReservations } from "../utils/adjustOrdersAfterReservations";

export function startWeeklyMenuPlanningJob() {
  // Corre Às 00:00 todos os dias 
  cron.schedule("00 00 * * *", async () => {
    console.log("📦 Weekly menu planning job started");

    try {
      // Gerar NeededProducts
      await generateNeededProductsFromPublishedMenus();

      // Gerar Orders de previsão
      await generateOrdersFromNeededProducts();

      // Gerar orders finais
      await adjustOrdersAfterReservations();

      console.log("✅ Weekly menu planning job finished");
    } catch (error) {
      console.error("❌ Weekly menu planning job failed:", error);
    }
  });
}
