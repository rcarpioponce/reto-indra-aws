import AWS from 'aws-sdk';
import { SnsAppointmentPublisher } from '../sns-appointment-publisher';
import { AppointmentInput } from '../../../application/dto/appointment-input.dto';

// Mock manual del módulo aws-sdk
jest.mock('aws-sdk', () => {
  const mockPublish = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  const SNS = jest.fn().mockImplementation(() => ({
    publish: mockPublish,
  }));

  return {
    SNS,
    config: { update: jest.fn() },
  };
});

describe('SnsAppointmentPublisher', () => {
  let publisher: SnsAppointmentPublisher;
  let mockPublish: jest.Mock;

  beforeEach(() => {
    const AWSMock = jest.requireMock('aws-sdk');
    mockPublish = AWSMock.SNS().publish;

    process.env.SNS_TOPIC = 'arn:aws:sns:us-east-1:123456789012:my-topic';
    publisher = new SnsAppointmentPublisher();
  });

  it('debe publicar un mensaje correctamente en SNS', async () => {
    const input: AppointmentInput & { id?: string } = {
      id: 'abc-123',
      insuredId: '12345',
      scheduleId: 789,
      countryISO: 'CL',
    };

    await publisher.publish(input);

    expect(mockPublish).toHaveBeenCalledWith({
      TopicArn: process.env.SNS_TOPIC,
      Message: JSON.stringify(input),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: 'CL',
        },
      },
    });
  });

  it('debe lanzar un error si SNS_TOPIC no está definido', async () => {
    delete process.env.SNS_TOPIC;
    publisher = new SnsAppointmentPublisher();

    await expect(
      publisher.publish({
        id: 'abc-123',
        insuredId: '12345',
        scheduleId: 789,
        countryISO: 'CL',
      })
    ).rejects.toThrow('SNS_TOPIC no definido');
  });
});
