import { AppointmentResultSchema } from '../appointment-result.dto';

describe('AppointmentResultSchema', () => {
  const validInput = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    insuredId: '12345',
    scheduleId: 100,
    countryISO: 'PE',
  };

  it('valida una entrada válida correctamente', () => {
    const result = AppointmentResultSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('falla si el id no es un UUID válido', () => {
    const result = AppointmentResultSchema.safeParse({
      ...validInput,
      id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('UUID válido');
    }
  });

  it('falla si insuredId tiene menos de 5 dígitos', () => {
    const result = AppointmentResultSchema.safeParse({
      ...validInput,
      insuredId: '1234',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exactamente 5 dígitos');
    }
  });

  it('falla si scheduleId es negativo', () => {
    const result = AppointmentResultSchema.safeParse({
      ...validInput,
      scheduleId: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('mayor que 0');
    }
  });

  it('falla si countryISO no es PE o CL', () => {
    const result = AppointmentResultSchema.safeParse({
      ...validInput,
      countryISO: 'CO',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("countryISO debe ser 'PE' o 'CL'");
    }
  });
});
