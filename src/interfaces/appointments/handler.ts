import { APIGatewayProxyHandler } from "aws-lambda";
import { handleGetAppointmentsByInsuredIdHttp } from "./get-appointments.controller";

/**
 * GET /appointments/{insuredId}
 * Devuelve todas las citas asociadas a un asegurado.
 * @returns {Array<Appointment>} 200 - Lista de agendamientos
 */
export const getAppointmentsByInsuredId: APIGatewayProxyHandler = async (event, context) => {
  return handleGetAppointmentsByInsuredIdHttp(event);
};

