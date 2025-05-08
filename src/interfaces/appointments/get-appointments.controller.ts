import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppointmentDynamoRepository } from "../../infrastructure/appointment/appointment-dynamo.repository";
import { badRequest, ok, internalError } from "../../shared/http/http-response";

/**
 * Manejador HTTP para listar agendamientos por insuredId
 */
export const handleGetAppointmentsByInsuredIdHttp = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const insuredId = event.pathParameters?.insuredId;

    if (!insuredId) {
      return badRequest("El parámetro insuredId es requerido en la URL");
    }

    const repository = new AppointmentDynamoRepository();
    const appointments = await repository.findByInsuredId(insuredId);

    return ok(appointments);
  } catch (error: any) {
    console.error("❌ Error inesperado al consultar citas:", error);
    return internalError("Error interno del servidor");
  }
};
