import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Constructor genérico de respuesta HTTP
 */
export const respond = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
});
/**
 * 200 - OK
 */
export const ok = (data: unknown) => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

/**
 * 400 - Bad Request
 */
export const badRequest = (message: string, errors?: string[]): APIGatewayProxyResult =>
  respond(400, { message, errors });

/**
 * 201 - Created
 */
export const created = (message: string, data: unknown): APIGatewayProxyResult =>
  respond(201, { message, data });

/**
 * 500 - Internal Server Error
 */
export const internalError = (message: string): APIGatewayProxyResult =>
  respond(500, { message });
