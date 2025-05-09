import { getAppointmentsByInsuredId } from '../handler';
import { handleGetAppointmentsByInsuredIdHttp } from '../get-appointments.controller';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../get-appointments.controller');

describe('getAppointmentsByInsuredId handler', () => {
  const mockHandler = handleGetAppointmentsByInsuredIdHttp as jest.Mock;

  const mockEvent = {
    pathParameters: { insuredId: '12345' },
  } as unknown as APIGatewayProxyEvent;

  const mockContext = {} as Context;

  afterEach(() => jest.clearAllMocks());

  it('delegates the call to handleGetAppointmentsByInsuredIdHttp and returns the result', async () => {
    const mockResponse = {
      statusCode: 200,
      body: JSON.stringify([{ id: '1' }, { id: '2' }]),
    };

    mockHandler.mockResolvedValue(mockResponse);

    const callback = jest.fn();
    const result = await getAppointmentsByInsuredId(mockEvent, mockContext, callback);

    expect(handleGetAppointmentsByInsuredIdHttp).toHaveBeenCalledWith(mockEvent);
    expect(result).toEqual(mockResponse);
  });
});
