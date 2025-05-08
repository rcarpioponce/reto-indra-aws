import { SQSEvent } from "aws-lambda";
import { AppointmentDynamoRepository } from "../../infrastructure/appointment/appointment-dynamo.repository";
import { processEvent } from "../../shared/events/process-event";
import { AppointmentResultSchema } from "../../shared/validation/appointment-result.schema";
import { AppointmentResult } from "../../domain/models/appointment-result";

export const resultHandler = async (event: SQSEvent): Promise<void> => {
  const repository = new AppointmentDynamoRepository();

  for (const record of event.Records) {
    try {
      console.log("📥 [RESULT] Mensaje bruto recibido desde SQS:", record.body);

      const eventBridgeMessage = JSON.parse(record.body);
      const message = eventBridgeMessage.detail;

      console.log("📨 [RESULT] Contenido real del mensaje:", message);

      const validated: AppointmentResult = AppointmentResultSchema.parse(message);

      const appointment = processEvent(validated); // convierte en modelo con status final

      await repository.updateStatus(appointment);

      console.log("✅ [RESULT] Agendamiento actualizado con status:", appointment.status);
    } catch (error) {
      console.error("❌ [RESULT] Error procesando mensaje:", error);
    }
  }
};
