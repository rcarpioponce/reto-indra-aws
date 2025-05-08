import { z } from "zod";
import { AppointmentResult } from "../../domain/models/appointment-result";

/**
 * Schema Zod que valida un evento de resultado de agendamiento.
 * Espera:
 * - id: UUID del agendamiento
 * - insuredId: ID de usuario
 * - scheduleId: número
 * - countryISO: "PE" | "CL"
 * - status: "SUCCESS" | "FAILURE"
 */
export const AppointmentResultSchema = z.object({
  id: z.string().uuid(),
  insuredId: z.string(),
  scheduleId: z.number(),
  countryISO: z.enum(["PE", "CL"]),
  status: z.enum(["SUCCESS", "FAILURE"]),
});

// Exportamos el tipo inferido si lo necesitas en otros lugares
export type AppointmentResultValidated = z.infer<typeof AppointmentResultSchema>;
