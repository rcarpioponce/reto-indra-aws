import { appointmentHandler } from '../handler';
import * as parseModule from '../../../shared/events/parse-message-id';
import { CreateAppointmentUseCase } from '../../../application/usecases/create-appointment.usecase';
import { RegisterAppointmentInRdsUseCase } from '../../../application/usecases/register-appointment-in-rds.usecase';
import { EventBridgeAppointmentPublisher } from '../../../infrastructure/events/eventbridge-appointment-publisher';

jest.mock('../../../application/usecases/create-appointment.usecase');
jest.mock('../../../application/usecases/register-appointment-in-rds.usecase');
jest.mock('../../../infrastructure/events/eventbridge-appointment-publisher');
jest.mock('../../../infrastructure/appointment/appointment-dynamo.repository');
jest.mock('../../../infrastructure/mysql/mysql-appointment.repository');

describe('appointmentHandler', () => {
  const validInput = {
    id: '12345-100',
    insuredId: '12345',
    scheduleId: 100,
    countryISO: 'PE',
    status: 'SUCCESS',
  };

  const record = {
    body: JSON.stringify({
      Message: JSON.stringify(validInput),
    }),
  };

  let mockExecuteCreate: jest.Mock;
  let mockExecuteRds: jest.Mock;
  let mockPublish: jest.Mock;

  beforeEach(() => {
    jest.spyOn(parseModule, 'parseMessageId').mockReturnValue({
      ...validInput,
      countryISO: 'PE' as 'PE' | 'CL'
    });

    mockExecuteCreate = jest.fn().mockResolvedValue(undefined);
    mockExecuteRds = jest.fn().mockResolvedValue(undefined);
    mockPublish = jest.fn().mockResolvedValue(undefined);

    (CreateAppointmentUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecuteCreate,
    }));

    (RegisterAppointmentInRdsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecuteRds,
    }));

    (EventBridgeAppointmentPublisher as jest.Mock).mockImplementation(() => ({
      publish: mockPublish,
    }));
  });

  afterEach(() => jest.clearAllMocks());

  it('procesa exitosamente y guarda en DynamoDB y MySQL', async () => {
    await appointmentHandler({ Records: [record] } as any);
    expect(mockExecuteCreate).toHaveBeenCalledWith(validInput);
    expect(mockExecuteRds).toHaveBeenCalledWith({
      id: validInput.id,
      insuredId: validInput.insuredId,
      scheduleId: validInput.scheduleId,
    });
    expect(mockPublish).not.toHaveBeenCalledWith(expect.objectContaining({ status: 'FAILURE' }));
  });

  it('publica FAILURE si falla DynamoDB', async () => {
    mockExecuteCreate.mockRejectedValue(new Error('dynamo error'));

    await appointmentHandler({ Records: [record] } as any);

    expect(mockPublish).toHaveBeenCalledWith(expect.objectContaining({
      ...validInput,
      status: 'FAILURE',
    }));
    expect(mockExecuteRds).not.toHaveBeenCalled();
  });

  it('publica FAILURE si falla MySQL', async () => {
    mockExecuteRds.mockRejectedValue(new Error('mysql error'));

    await appointmentHandler({ Records: [record] } as any);

    expect(mockPublish).toHaveBeenCalledWith(expect.objectContaining({
      ...validInput,
      status: 'FAILURE',
    }));
  });

  it('maneja error general y publica FAILURE si hay enrichedInput', async () => {
    jest.spyOn(parseModule, 'parseMessageId').mockImplementation(() => {
      throw new Error('invalid');
    });

    await appointmentHandler({ Records: [record] } as any);

    expect(mockPublish).not.toHaveBeenCalled(); // porque enrichedInput no se define
  });
});
