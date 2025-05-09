import { parseMessage } from '../parse-message';
import { AppointmentInput } from '../../../application/dto/appointment-input.dto';

describe('parseMessage', () => {
  const validMessage: AppointmentInput = {
    insuredId: '12345',
    scheduleId: 101,
    countryISO: 'CL',
  };

  it('retorna los datos validados si el mensaje es válido', () => {
    const result = parseMessage(validMessage);
    expect(result).toEqual(validMessage);
  });

  it('convierte scheduleId tipo string a number si schema lo permite', () => {
    const message = {
      ...validMessage,
      scheduleId: '101',
    };
    expect(() => parseMessage(message)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('scheduleId debe ser un número')
      })
    );
  });

  it('lanza un error si insuredId está vacío', () => {
    const message = { ...validMessage, insuredId: '' };
    expect(() => parseMessage(message)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('insuredId debe tener exactamente 5 dígitos numéricos')
      })
    );
  });

  it('lanza un error si falta countryISO', () => {
    const message = { ...validMessage };
    delete (message as any).countryISO;

    expect(() => parseMessage(message)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining("countryISO debe ser 'PE' o 'CL'")
      })
    );
  });

  it('lanza un error si el mensaje no es un objeto', () => {
    const message = 'not an object';
    expect(() => parseMessage(message)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Expected object, received string')
      })
    );
  });
});
