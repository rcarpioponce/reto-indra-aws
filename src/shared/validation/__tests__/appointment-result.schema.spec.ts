import { AppointmentResultSchema } from '../appointment-result.schema';

describe('AppointmentResultSchema', () => {
  const validInput = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    insuredId: '12345',
    scheduleId: 101,
    countryISO: 'PE',
    status: 'SUCCESS',
  };

  it('valida correctamente un resultado válido', () => {
    const result = AppointmentResultSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
  });

  it('falla si el id no es un UUID', () => {
    const input = { ...validInput, id: 'not-a-uuid' };
    const result = AppointmentResultSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('id');
    }
  });

  it('falla si el scheduleId no es un número', () => {
    const input = { ...validInput, scheduleId: 'abc' };
    const result = AppointmentResultSchema.safeParse(input);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('scheduleId');
    }
  });

    it('falla si el status no es válido', () => {
      const input = { ...validInput, status: 'INVALID_STATUS' };
      const result = AppointmentResultSchema.safeParse(input);
  
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid enum value');
      }
    }); 
});
