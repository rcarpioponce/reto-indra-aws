import { SNSEvent } from 'aws-lambda';

export const logEvent = (event: SNSEvent): void => {
  console.log('--- Evento SNS recibido ---');
  event.Records.forEach((record, index) => {
    console.log(`📩 Registro #${index + 1}:`);
    console.log(JSON.stringify(record.Sns, null, 2));
  });
};
