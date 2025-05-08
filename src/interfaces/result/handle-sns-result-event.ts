import { SNSEvent } from "aws-lambda";
import { parseSnsMessage } from "../../shared/utils/parse-sns-message";
import { parseMessage } from "../../shared/utils/parse-message";
import { ResultDynamoRepository } from "../../infrastructure/result/result-dynamo.repository";
import { SaveResultUseCase } from "../../application/usecases/save-result.usecase";
import { AppointmentResult } from "../../domain/models/appointment-result";

export const handleSnsResultEvent = async (event: SNSEvent): Promise<void> => {
  const repository = new ResultDynamoRepository();
  const useCase = new SaveResultUseCase(repository);

  for (const record of event.Records) {
    try {
      // Corrigiendo el tipo para parseSnsMessage (espera {Message: string})
      const message = record.Sns.Message;
      const rawMessage = parseSnsMessage({ Message: message });
      if (!rawMessage) continue;

      // Obteniendo los datos del mensaje
      const parsedData = parseMessage(rawMessage);
      
      // Creando un objeto que cumpla con la interfaz AppointmentResult
      const validated: AppointmentResult = {
        id: `${parsedData.insuredId}-${parsedData.scheduleId}`, // Generamos un ID con base en los datos
        status: "SUCCESS", // Asumimos éxito por defecto, ajusta según tu lógica de negocio
        insuredId: parsedData.insuredId,
        scheduleId: parsedData.scheduleId,
        countryISO: parsedData.countryISO
      };
      
      await useCase.execute(validated);
      console.log("Resultado guardado correctamente.");
    } catch (error) {
      console.error("Error procesando el mensaje:", error);
    }
  }
};
