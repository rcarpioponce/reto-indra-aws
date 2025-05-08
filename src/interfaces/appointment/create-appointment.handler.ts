import { APIGatewayProxyHandler } from "aws-lambda";
import { handleCreateAppointmentHttp } from "./create-appointment.controller";

export const createAppointment: APIGatewayProxyHandler = async (event, context) => {
  return handleCreateAppointmentHttp(event);
};
