import { publishEvent } from '../event-bridge-publisher';

jest.mock('aws-sdk', () => {
  const putEventsMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ Entries: [{ EventId: '1' }] }),
  });

  const EventBridge = jest.fn().mockImplementation(() => ({
    putEvents: putEventsMock,
  }));

  return {
    EventBridge,
    config: { update: jest.fn() },
  };
});

describe('publishEvent', () => {
  let putEventsMock: jest.Mock;

  beforeEach(() => {
    const AWSMock = jest.requireMock('aws-sdk');
    putEventsMock = AWSMock.EventBridge().putEvents;
    process.env.EVENT_BUS_NAME = 'test-bus';
  });

  it('publica un evento exitosamente en EventBridge', async () => {
    const input = {
      source: 'appointment_cl',
      detailType: 'event_result',
      detail: { id: '123', status: 'completed' },
    };

    await publishEvent(input);

    expect(putEventsMock).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: 'test-bus',
          Source: 'appointment_cl',
          DetailType: 'event_result',
          Detail: JSON.stringify(input.detail),
        },
      ],
    });
  });

  it('lanza un error si putEvents falla', async () => {
    putEventsMock.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error('EventBridge error')),
    });

    const input = {
      source: 'appointment_cl',
      detailType: 'event_result',
      detail: { id: '456' },
    };

    await expect(publishEvent(input)).rejects.toThrow('EventBridge error');
  });
});
