import { logEvent } from '../log-event';
import { SNSEvent } from 'aws-lambda';

describe('logEvent', () => {
  const mockConsole = jest.spyOn(console, 'log').mockImplementation(() => {});

  afterEach(() => {
    mockConsole.mockClear();
  });

  afterAll(() => {
    mockConsole.mockRestore();
  });

  it('debe loguear cada registro SNS del evento', () => {
    const event: SNSEvent = {
      Records: [
        {
          EventSource: 'aws:sns',
          EventVersion: '1.0',
          EventSubscriptionArn: 'arn:aws:sns:...',
          Sns: {
            Message: '{"test": "value"}',
            MessageId: '1',
            Signature: '',
            SignatureVersion: '',
            SigningCertUrl: '',
            Subject: 'Test',
            Timestamp: new Date().toISOString(),
            TopicArn: 'arn:aws:sns:...',
            Type: 'Notification',
            UnsubscribeUrl: '',
            MessageAttributes: {},
          },
        },
      ],
    };

    logEvent(event);

    expect(mockConsole).toHaveBeenCalledWith('--- Evento SNS recibido ---');
    expect(mockConsole).toHaveBeenCalledWith('📩 Registro #1:');
    expect(mockConsole).toHaveBeenCalledWith(
      JSON.stringify(event.Records[0].Sns, null, 2)
    );
  });
});
