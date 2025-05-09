import { handleGetAppointmentsByInsuredIdHttp } from '../get-appointments.controller';
import { AppointmentDynamoRepository } from '../../../infrastructure/appointment/appointment-dynamo.repository';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('../../../infrastructure/appointment/appointment-dynamo.repository');

describe('handleGetAppointmentsByInsuredIdHttp', () => {
  const mockFind = jest.fn();

  beforeEach(() => {
    (AppointmentDynamoRepository as jest.Mock).mockImplementation(() => ({
      findByInsuredId: mockFind,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const buildEvent = (insuredId?: string): APIGatewayProxyEvent =>
    ({
      pathParameters: insuredId ? { insuredId } : undefined,
    } as any);

  it('retorna 200 con citas si insuredId es válido', async () => {
    const data = [{ id: '1' }, { id: '2' }];
    mockFind.mockResolvedValue(data);

    const response = await handleGetAppointmentsByInsuredIdHttp(buildEvent('12345'));

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(data);
    expect(mockFind).toHaveBeenCalledWith('12345');
  });

  it('retorna 400 si insuredId no está en pathParameters', async () => {
    const response = await handleGetAppointmentsByInsuredIdHttp(buildEvent());

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toMatch(/requerido/i);
    expect(mockFind).not.toHaveBeenCalled();
  });

  it('retorna 500 si ocurre un error inesperado en el repositorio', async () => {
    mockFind.mockRejectedValue(new Error('DynamoDB down'));

    const response = await handleGetAppointmentsByInsuredIdHttp(buildEvent('12345'));

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toMatch(/interno/i);
    expect(mockFind).toHaveBeenCalled();
  });
});
