import { SQSEvent } from "aws-lambda";
import { parseSnsMessage } from "../../shared/utils/parse-sns-message";
import { parseMessage } from "../../shared/utils/parse-message";
import { ResultDynamoRepository } from "../../infrastructure/result/result-dynamo.repository";
import { SaveResultUseCase } from "../../application/usecases/save-result.usecase";
import { AppointmentResult } from "../../domain/models/appointment-result";

/**
 * Handler para procesar eventos SNS encapsulados en mensajes SQS
 */
export const handleSnsResultEvent = async (event: SQSEvent): Promise<void> => {
  const repository = new ResultDynamoRepository();
  const useCase = new SaveResultUseCase(repository);

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const rawMessage = parseSnsMessage(body); // body contiene { Sns: { Message: "..." } }

      if (!rawMessage) continue;

      const validated = parseMessage(rawMessage);
      
      // Transform validated object to match AppointmentResult type
      const appointmentResult: AppointmentResult = {
        ...validated,
        id: validated.insuredId + '-' + validated.scheduleId, // Generate an ID using existing fields
        status: "SUCCESS" // Default status or extract from message if available
      };
      
      await useCase.execute(appointmentResult);

      console.log("Resultado guardado correctamente.");
    } catch (error) {
      console.error("Error procesando el mensaje:", error);
    }
  }
};
