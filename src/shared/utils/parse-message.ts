import { AppointmentInputSchema, AppointmentInput } from "../../application/dto/appointment-input.dto";

/**
 * Valida un mensaje recibido contra el esquema de AppointmentInput.
 * Se espera que el mensaje tenga:
 * - insuredId: string
 * - scheduleId: string o number
 * - countryISO: "PE" | "CL"
 */
export const parseMessage = (message: unknown): AppointmentInput => {
  const result = AppointmentInputSchema.safeParse(message);

  if (!result.success) {
    throw new Error(
      `Mensaje inválido: ${JSON.stringify(result.error.issues, null, 2)}`
    );
  }

  return result.data;
};
