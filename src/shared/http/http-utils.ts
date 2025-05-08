import { APIGatewayProxyEvent } from "aws-lambda";

export const parseRequestBody = (event: APIGatewayProxyEvent): unknown => {
  try {
    return JSON.parse(event.body ?? "{}");
  } catch {
    throw new Error("El cuerpo de la solicitud no es un JSON válido");
  }
};
