import AWS from 'aws-sdk';
import { AppointmentDynamoRepository } from '../appointment-dynamo.repository';
import { Appointment } from '../../../domain/models/appointment';

jest.mock('aws-sdk');

describe('AppointmentDynamoRepository', () => {
  let repo: AppointmentDynamoRepository;
  let mockPut: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockPut = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue(undefined) });
    mockUpdate = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue(undefined) });
    mockQuery = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Items: [] }) });

    (AWS.DynamoDB.DocumentClient as jest.Mock).mockImplementation(() => ({
      put: mockPut,
      update: mockUpdate,
      query: mockQuery,
    }));

    process.env.DYNAMODB_TABLE = 'appointments';
    repo = new AppointmentDynamoRepository();
  });

  it('debe guardar una cita con put()', async () => {
    const appointment: Appointment = {
      id: '1',
      insuredId: '12345',
      scheduleId: 100,
      countryISO: 'PE',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await repo.save(appointment);

    expect(mockPut).toHaveBeenCalledWith({
      TableName: 'appointments',
      Item: appointment,
    });
  });

  it('debe actualizar el estado con update()', async () => {
    const appointment: Appointment = {
      id: '1',
      insuredId: '12345',
      scheduleId: 100,
      countryISO: 'PE',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    await repo.updateStatus(appointment);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'appointments',
        Key: { id: appointment.id },
        UpdateExpression: expect.any(String),
      })
    );
  });

  it('debe lanzar error si se llama updateStatus sin id', async () => {
    const appointment = {
      insuredId: '12345',
      scheduleId: 100,
      countryISO: 'PE',
      status: 'completed',
      createdAt: new Date().toISOString(),
    } as any;

    await expect(repo.updateStatus(appointment)).rejects.toThrow('Appointment ID is required for update');
  });

  it('debe retornar resultados desde findByInsuredId()', async () => {
    const mockItems = [
      {
        id: '1',
        insuredId: '12345',
        scheduleId: 100,
        countryISO: 'PE',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];

    mockQuery.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({ Items: mockItems }),
    });

    const result = await repo.findByInsuredId('12345');
    expect(result).toEqual(mockItems);
    expect(mockQuery).toHaveBeenCalledWith({
      TableName: 'appointments',
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': '12345',
      },
    });
  });
});
