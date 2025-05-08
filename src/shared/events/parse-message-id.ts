import { AppointmentResultSchema, AppointmentResult } from '../../application/dto/appointment-result.dto';

export const parseMessageId = (message: unknown): AppointmentResult => {
  const result = AppointmentResultSchema.safeParse(message);
  if (!result.success) {
    throw new Error(`Mensaje inválido: ${JSON.stringify(result.error.issues)}`);
  }
  return result.data;
};
