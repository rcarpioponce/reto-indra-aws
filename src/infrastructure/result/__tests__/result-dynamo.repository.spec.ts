import AWS from 'aws-sdk';
import { ResultDynamoRepository } from '../result-dynamo.repository';
import { AppointmentResult } from '../../../domain/models/appointment-result';

// Mock del módulo aws-sdk
jest.mock('aws-sdk', () => {
  const putMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  const DocumentClient = jest.fn().mockImplementation(() => ({
    put: putMock,
  }));

  return {
    DynamoDB: {
      DocumentClient,
    },
  };
});

describe('ResultDynamoRepository', () => {
  let repository: ResultDynamoRepository;
  let putMock: jest.Mock;

  beforeEach(() => {
    process.env.DYNAMODB_TABLE = 'appointments';
    const AWSMock = jest.requireMock('aws-sdk');
    putMock = AWSMock.DynamoDB.DocumentClient().put;

    repository = new ResultDynamoRepository();
  });

  it('debe guardar el resultado en DynamoDB usando put()', async () => {
    const result: AppointmentResult = {
      id: 'uuid-456',
      insuredId: '12345',
      scheduleId: 789,
      countryISO: 'CL',
      status: 'SUCCESS',
    };

    await repository.save(result);

    expect(putMock).toHaveBeenCalledWith({
      TableName: 'appointments',
      Item: result,
    });
  });
});
