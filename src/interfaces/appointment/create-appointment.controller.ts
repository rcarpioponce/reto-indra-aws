import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppointmentInputSchema } from "../../application/dto/appointment-input.dto";
import { ZodValidator } from "../../shared/validation/appointment-input.validator";
import { badRequest, created, internalError } from "../../shared/http/http-response";
import { parseRequestBody } from "../../shared/http/http-utils";
import { v4 as uuidv4 } from "uuid";
import { SnsAppointmentPublisher } from "../../infrastructure/events/sns-appointment-publisher"; // 👈 usa SNS, no useCase

const validator = new ZodValidator(AppointmentInputSchema);
const publisher = new SnsAppointmentPublisher();

/**
 * Manejador HTTP para publicar un agendamiento en SNS (según país)
 */
export const handleCreateAppointmentHttp = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const input = parseRequestBody(event);

    const result = validator.validate(input);
    if (!result.success) {
      return badRequest("Errores de validación", result.errors);
    }

    // Generar ID y publicar en SNS
    const appointmentData = {
      ...result.data,
      id: uuidv4(),
    };

    await publisher.publish(appointmentData); // 👈 solo publica

    return created("Agendamiento en proceso", appointmentData);
  } catch (error: any) {
    console.error("Error inesperado en controlador:", error);
    return internalError("Error interno del servidor");
  }
};
