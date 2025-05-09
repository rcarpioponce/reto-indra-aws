import { AppointmentInputSchema } from '../appointment-input.dto';
import { ZodError } from 'zod';

describe('AppointmentInputSchema', () => {
  const validInput = {
    insuredId: '12345',
    scheduleId: 100,
    countryISO: 'PE',
  };

  it('valida una entrada correcta sin errores', () => {
    const result = AppointmentInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('falla si insuredId tiene menos de 5 dígitos', () => {
    const result = AppointmentInputSchema.safeParse({
      ...validInput,
      insuredId: '1234',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exactamente 5 dígitos');
    }
  });

  it('falla si insuredId contiene letras', () => {
    const result = AppointmentInputSchema.safeParse({
      ...validInput,
      insuredId: '12A45',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exactamente 5 dígitos');
    }
  });

  it('falla si scheduleId es negativo', () => {
    const result = AppointmentInputSchema.safeParse({
      ...validInput,
      scheduleId: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('mayor que 0');
    }
  });

  it('falla si countryISO es inválido', () => {
    const result = AppointmentInputSchema.safeParse({
      ...validInput,
      countryISO: 'AR', // no permitido
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("countryISO debe ser 'PE' o 'CL'");
    }
  });
});
