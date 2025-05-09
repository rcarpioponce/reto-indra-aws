import AWS from 'aws-sdk';
import { EventBridgeAppointmentPublisher } from '../eventbridge-appointment-publisher';
import { AppointmentInput } from '../../../application/dto/appointment-input.dto';

// MOCK DEL MODULO COMPLETO
jest.mock('aws-sdk', () => {
  const mockPutEvents = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  const EventBridge = jest.fn().mockImplementation(() => ({
    putEvents: mockPutEvents,
  }));

  return {
    EventBridge,
    config: { update: jest.fn() },
  };
});

describe('EventBridgeAppointmentPublisher', () => {
  let publisher: EventBridgeAppointmentPublisher;
  let mockPutEvents: jest.Mock;

  beforeEach(() => {
    // Accedemos al mock para verificar llamadas
    const AWSMock = jest.requireMock('aws-sdk');
    mockPutEvents = AWSMock.EventBridge().putEvents;

    process.env.EVENT_BUS_NAME = 'MyEventBus';
    publisher = new EventBridgeAppointmentPublisher();
  });

  it('debe publicar un evento correctamente en EventBridge', async () => {
    const input: AppointmentInput & { id: string } = {
      id: 'uuid-abc',
      insuredId: '12345',
      scheduleId: 100,
      countryISO: 'PE',
    };

    await publisher.publish(input);

    expect(mockPutEvents).toHaveBeenCalledWith({
      Entries: [
        {
          Source: 'appointment_pe',
          DetailType: 'event_update_appointment',
          Detail: JSON.stringify({
            id: 'uuid-abc',
            insuredId: '12345',
            scheduleId: 100,
            countryISO: 'PE',
            status: 'SUCCESS',
          }),
          EventBusName: 'MyEventBus',
        },
      ],
    });
  });
});
