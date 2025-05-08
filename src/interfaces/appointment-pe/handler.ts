import { SQSEvent } from "aws-lambda";
import { parseMessageId } from "../../shared/events/parse-message-id";
import { AppointmentDynamoRepository } from "../../infrastructure/appointment/appointment-dynamo.repository";
import { CreateAppointmentUseCase } from "../../application/usecases/create-appointment.usecase";
import { EventBridgeAppointmentPublisher } from "../../infrastructure/events/eventbridge-appointment-publisher";
import { RegisterAppointmentInRdsUseCase } from "../../application/usecases/register-appointment-in-rds.usecase";
import { MySQLAppointmentRepository } from "../../infrastructure/mysql/mysql-appointment.repository";

export const appointmentHandler = async (event: SQSEvent): Promise<void> => {
  const dynamoRepository = new AppointmentDynamoRepository();
  const rdsRepository = new MySQLAppointmentRepository("PE");
  const publisher = new EventBridgeAppointmentPublisher();

  const createUseCase = new CreateAppointmentUseCase(dynamoRepository, publisher);
  const rdsUseCase = new RegisterAppointmentInRdsUseCase(rdsRepository);

  for (const record of event.Records) {
    let enrichedInput: any;

    try {
      console.log("📥 [PE] Mensaje bruto recibido desde SQS:", record.body);
      const rawSnsMessage = JSON.parse(record.body);
      const message = JSON.parse(rawSnsMessage.Message);
      console.log("📨 [PE] Contenido real del mensaje:", message);

      const validated = parseMessageId(message);
      enrichedInput = { ...validated };

      // Paso 1: Guardar en DynamoDB
      try {
        await createUseCase.execute(enrichedInput);
        console.log("✅ [PE] Guardado en DynamoDB");
      } catch (dynamoError) {
        console.error("❌ [PE] Error en DynamoDB:", dynamoError);
        await publisher.publish({ ...enrichedInput, status: "FAILURE" });
        continue;
      }

      // Paso 2: Guardar en MySQL
      try {
        await rdsUseCase.execute({
          id: enrichedInput.id,
          insuredId: enrichedInput.insuredId,
          scheduleId: enrichedInput.scheduleId,
        });
        console.log("✅ [PE] Guardado en MySQL");
      } catch (rdsError) {
        console.error("❌ [PE] Error en MySQL:", rdsError);
        await publisher.publish({ ...enrichedInput, status: "FAILURE" });
        continue;
      }

      // Éxito total
      console.log("✅ [PE] Agendamiento procesado exitosamente");

    } catch (error) {
      console.error("❌ [PE] Error general procesando evento:", error);
      if (enrichedInput) {
        try {
          await publisher.publish({ ...enrichedInput, status: "FAILURE" });
          console.log("⚠️ [PE] Evento de fallo publicado");
        } catch (pubErr) {
          console.error("❌ [PE] Error publicando fallo en EventBridge:", pubErr);
        }
      }
    }
  }
};
