import { AppointmentInputSchema, AppointmentInput } from '../../application/dto/appointment-input.dto';

export const parseMessage = (message: unknown): AppointmentInput => {
  const result = AppointmentInputSchema.safeParse(message);
  if (!result.success) {
    throw new Error(`Mensaje inválido: ${JSON.stringify(result.error.issues)}`);
  }
  return result.data;
};
