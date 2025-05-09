import { parseMessageId } from '../parse-message-id';
import { AppointmentResult } from '../../../application/dto/appointment-result.dto';

describe('parseMessageId', () => {
  const validMessage: AppointmentResult = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    insuredId: '12345',
    scheduleId: 100,
    countryISO: 'PE',
  };

  it('retorna el objeto validado si el mensaje es válido', () => {
    const result = parseMessageId(validMessage);
    expect(result).toEqual(validMessage);
  });

  it('lanza error si el id no es un UUID', () => {
    const invalid = { ...validMessage, id: 'not-a-uuid' };
    expect(() => parseMessageId(invalid)).toThrow(/Mensaje inválido/);
  });

  it('lanza error si falta countryISO', () => {
    const { countryISO, ...invalid } = validMessage;
    expect(() => parseMessageId(invalid)).toThrow(/Mensaje inválido/);
  });

});
