import { APIGatewayProxyEvent } from 'aws-lambda';
import { parseRequestBody } from '../http-utils'; // ajusta si tu archivo tiene otro nombre

describe('parseRequestBody', () => {
  it('debe retornar el objeto si el body es un JSON válido', () => {
    const event = {
      body: JSON.stringify({ name: 'Gael', age: 2 }),
    } as APIGatewayProxyEvent;

    const result = parseRequestBody(event);
    expect(result).toEqual({ name: 'Gael', age: 2 });
  });

  it('debe retornar un objeto vacío si body es undefined', () => {
    const event = {
      body: undefined,
    } as unknown as APIGatewayProxyEvent;

    const result = parseRequestBody(event);
    expect(result).toEqual({});
  });

  it('debe retornar un objeto vacío si body es null', () => {
    const event = {
      body: null,
    } as unknown as APIGatewayProxyEvent;

    const result = parseRequestBody(event);
    expect(result).toEqual({});
  });

  it('debe lanzar error si el body no es un JSON válido', () => {
    const event = {
      body: 'esto no es JSON válido',
    } as APIGatewayProxyEvent;

    expect(() => parseRequestBody(event)).toThrow(
      'El cuerpo de la solicitud no es un JSON válido'
    );
  });
});
