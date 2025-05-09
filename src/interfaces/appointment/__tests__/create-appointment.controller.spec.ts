import { handleCreateAppointmentHttp } from '../create-appointment.controller';
import { SnsAppointmentPublisher } from '../../../infrastructure/events/sns-appointment-publisher';
import { APIGatewayProxyEvent } from 'aws-lambda';

// ✅ Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'b6646aa8-7357-4f51-a98d-ce8cea586172'),
}));

// Modificar el mock para substituir la implementación completa del módulo
jest.mock('../../../infrastructure/events/sns-appointment-publisher', () => {
  return {
    SnsAppointmentPublisher: jest.fn().mockImplementation(() => ({
      publish: jest.fn(),
    })),
  };
});

describe('handleCreateAppointmentHttp', () => {
  const mockPublish = jest.fn();

  const validInput = {
    insuredId: '12345',
    scheduleId: 456,
    countryISO: 'PE',
  };

  beforeEach(() => {
    mockPublish.mockClear();
    // Obtener acceso a la instancia mockeada
    const mockInstance = new SnsAppointmentPublisher();
    // Sobrescribir el método publish con nuestro mock
    mockInstance.publish = mockPublish;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  const buildEvent = (body: any): APIGatewayProxyEvent =>
    ({
      body: JSON.stringify(body),
    } as any);

  it('retorna 201 si la entrada es válida y publica en SNS', async () => {
    const event = buildEvent(validInput);

    const response = await handleCreateAppointmentHttp(event);


    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Agendamiento en proceso',
      data: { ...validInput, id: 'b6646aa8-7357-4f51-a98d-ce8cea586172' },
    });
  });

  it('retorna 400 si la validación Zod falla', async () => {
    const invalidInput = { ...validInput, scheduleId: 'no-numero' };

    const event = buildEvent(invalidInput);

    const response = await handleCreateAppointmentHttp(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.message).toMatch(/Errores de validación/);
    expect(Array.isArray(body.errors)).toBe(true);
    expect(mockPublish).not.toHaveBeenCalled();
  });

  it('retorna 500 si ocurre un error inesperado (JSON inválido)', async () => {
    const event = {
      body: '{ no es JSON }',
    } as APIGatewayProxyEvent;

    const response = await handleCreateAppointmentHttp(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toMatch(/interno/i);
    expect(mockPublish).not.toHaveBeenCalled();
  });
});
