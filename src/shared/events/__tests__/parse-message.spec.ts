import { parseMessage } from '../parse-message';
import { AppointmentInput } from '../../../application/dto/appointment-input.dto';

describe('parseMessage', () => {
  const validMessage: AppointmentInput = {
    insuredId: '12345',
    scheduleId: 100,
    countryISO: 'CL',
  };

  it('retorna los datos si el mensaje es válido', () => {
    const result = parseMessage(validMessage);
    expect(result).toEqual(validMessage);
  });

  it('lanza error si insuredId no tiene 5 dígitos', () => {
    const invalid = { ...validMessage, insuredId: '123' };
    expect(() => parseMessage(invalid)).toThrow(/Mensaje inválido/);
  });

  it('lanza error si scheduleId no es un número', () => {
    const invalid = { ...validMessage, scheduleId: 'abc' };
    expect(() => parseMessage(invalid)).toThrow(/Mensaje inválido/);
  });

  it('lanza error si countryISO no es PE ni CL', () => {
    const invalid = { ...validMessage, countryISO: 'AR' as any };
    expect(() => parseMessage(invalid)).toThrow(/Mensaje inválido/);
  });

  it('lanza error si falta insuredId', () => {
    const { insuredId, ...invalid } = validMessage;
    expect(() => parseMessage(invalid)).toThrow(/Mensaje inválido/);
  });
});
