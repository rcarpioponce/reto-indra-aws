import { resultHandler } from '../handler';
import * as processModule from '../../../shared/events/process-event';
import { AppointmentDynamoRepository } from '../../../infrastructure/appointment/appointment-dynamo.repository';
import { AppointmentResult } from '../../../application/dto/appointment-result.dto';
import { AppointmentResultSchema } from '../../../shared/validation/appointment-result.schema';

jest.mock('../../../infrastructure/appointment/appointment-dynamo.repository');

describe('resultHandler', () => {
  const validMessage: AppointmentResult = {
    id: '550e8400-e29b-41d4-a716-446655440000', // UUID válido
    insuredId: '123',
    scheduleId: 456,
    countryISO: 'PE',
  };

  const appointmentMock = {
    id: validMessage.id,
    insuredId: validMessage.insuredId,
    scheduleId: validMessage.scheduleId,
    countryISO: validMessage.countryISO,
    status: 'completed' as 'pending' | 'completed',
    createdAt: new Date().toISOString(),
  };

  let mockUpdateStatus: jest.Mock;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockUpdateStatus = jest.fn().mockResolvedValue(undefined);
    (AppointmentDynamoRepository as jest.Mock).mockImplementation(() => ({
      updateStatus: mockUpdateStatus,
    }));

    jest
      .spyOn(processModule, 'processEvent')
      .mockImplementation(() => appointmentMock);

    jest
      .spyOn(AppointmentResultSchema, 'parse')
      .mockImplementation((data) => ({...validMessage, status: 'SUCCESS'})); // Asegura que no falle el schema
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const buildEvent = (body: any) => ({
    Records: [
      {
        body: JSON.stringify(body),
      },
    ],
  });

  it('procesa un mensaje válido y actualiza el estado en DynamoDB', async () => {
    const event = buildEvent({ detail: validMessage });

    await resultHandler(event as any);

    expect(mockUpdateStatus).toHaveBeenCalledWith(appointmentMock);
  });

  it('logea error si el JSON del body está mal formado', async () => {
    const event = {
      Records: [{ body: '{ invalid json' }],
    };

    await resultHandler(event as any);

    expect(console.error).toHaveBeenCalledWith(
      '❌ [RESULT] Error procesando mensaje:',
      expect.any(SyntaxError)
    );

    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('logea error si la validación Zod falla', async () => {
    jest
      .spyOn(AppointmentResultSchema, 'parse')
      .mockImplementation(() => {
        throw new Error('Validation failed');
      });

    const event = buildEvent({ detail: validMessage });

    await resultHandler(event as any);

    expect(console.error).toHaveBeenCalledWith(
      '❌ [RESULT] Error procesando mensaje:',
      expect.any(Error)
    );

    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });

  it('logea error si updateStatus lanza excepción', async () => {
    mockUpdateStatus.mockRejectedValueOnce(new Error('dynamo error'));

    const event = buildEvent({ detail: validMessage });

    await resultHandler(event as any);

    expect(console.error).toHaveBeenCalledWith(
      '❌ [RESULT] Error procesando mensaje:',
      expect.any(Error)
    );
  });
});
