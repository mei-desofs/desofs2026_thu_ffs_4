const cron = require("node-cron");
import { ReservationService } from "../Service/ReservationService";

const reservationService = new ReservationService();


// Job de TESTE - Verifica reservas ativas para uma data específica

export function startMarkUnconsumedReservationsJob() {
  // 🧪 JOB DE TESTE - Executa às -:- todos os dias
  cron.schedule("42 3 * * *", async () => {
    try {
      // Data específica para teste: 25/12/2025
      const testDate = new Date(2026, 0, 16); // Mês 11 = Dezembro (0-indexed)
      console.log(" [TESTE] Iniciando verificação de marcações não consumidas (18:15)...");
      console.log(` [TESTE] Verificar marcações do dia seleciondo`);
      const result = await reservationService.markUnconsumedReservations(testDate);
      console.log(` [TESTE] ${result.message}`);
    } catch (error) {
      console.error("❌ [TESTE] Erro ao marcar marcações não consumidas:", error);
    }
  });
  console.log("🧪 Job de TESTE agendado para 18:15 - Verifica marcações do dia 25/12/2025");
}

/**
 * Função para agendar um job de teste em um horário específico
 * Útil para testes durante desenvolvimento
 * @param hour - Hora (0-23)
 * @param minute - Minuto (0-59)
 * @returns A tarefa agendada (pode ser cancelada com .stop())
 */
export function scheduleTestJob(hour: number, minute: number) {
  const cronExpression = `${minute} ${hour} * * *`;
  console.log(`🧪 Agendando job de TESTE para ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  
  const task = cron.schedule(cronExpression, async () => {
    try {
      console.log(`🔄 [TESTE] Iniciando verificação de marcações não consumidas (${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')})...`);
      const result = await reservationService.markUnconsumedReservations();
      console.log(`✅ [TESTE] ${result.message}`);
    } catch (error) {
      console.error("❌ [TESTE] Erro ao marcar marcações não consumidas:", error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Lisbon"
  });

  return task;
}

