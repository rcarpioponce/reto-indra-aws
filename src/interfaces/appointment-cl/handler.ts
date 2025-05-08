import { SQSEvent } from "aws-lambda";
import { parseMessageId } from "../../shared/events/parse-message-id";
import { AppointmentDynamoRepository } from "../../infrastructure/appointment/appointment-dynamo.repository";
import { CreateAppointmentUseCase } from "../../application/usecases/create-appointment.usecase";
import { EventBridgeAppointmentPublisher } from "../../infrastructure/events/eventbridge-appointment-publisher";
import { RegisterAppointmentInRdsUseCase } from "../../application/usecases/register-appointment-in-rds.usecase";
import { MySQLAppointmentRepository } from "../../infrastructure/mysql/mysql-appointment.repository";

export const appointmentHandler = async (event: SQSEvent): Promise<void> => {
  const dynamoRepository = new AppointmentDynamoRepository();
  const rdsRepository = new MySQLAppointmentRepository("CL");
  const publisher = new EventBridgeAppointmentPublisher();

  const createUseCase = new CreateAppointmentUseCase(dynamoRepository, publisher);
  const rdsUseCase = new RegisterAppointmentInRdsUseCase(rdsRepository);

  for (const record of event.Records) {
    let enrichedInput: any;

    try {
      console.log("📥 [CL] Mensaje bruto recibido desde SQS:", record.body);
      const rawSnsMessage = JSON.parse(record.body);
      const message = JSON.parse(rawSnsMessage.Message);
      console.log("📨 [CL] Contenido real del mensaje:", message);

      const validated = parseMessageId(message);
      enrichedInput = { ...validated };

      // Paso 1: Guardar en DynamoDB
      try {
        await createUseCase.execute(enrichedInput);
        console.log("✅ [CL] Guardado en DynamoDB");
      } catch (dynamoError) {
        console.error("❌ [CL] Error en DynamoDB:", dynamoError);
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
        console.log("✅ [CL] Guardado en MySQL");
      } catch (rdsError) {
        console.error("❌ [CL] Error en MySQL:", rdsError);
        await publisher.publish({ ...enrichedInput, status: "FAILURE" });
        continue;
      }

      console.log("✅ [CL] Agendamiento procesado exitosamente");

    } catch (error) {
      console.error("❌ [CL] Error general procesando evento:", error);
      if (enrichedInput) {
        try {
          await publisher.publish({ ...enrichedInput, status: "FAILURE" });
          console.log("⚠️ [CL] Evento de fallo publicado");
        } catch (pubErr) {
          console.error("❌ [CL] Error publicando fallo en EventBridge:", pubErr);
        }
      }
    }
  }
};
