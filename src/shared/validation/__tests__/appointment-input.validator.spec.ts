import { z } from 'zod';
import { ZodValidator } from '../appointment-input.validator';

describe('ZodValidator', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().min(0),
  });

  const validator = new ZodValidator(schema);

  it('debe retornar success: true si la validación es correcta', () => {
    const input = { name: 'Gael', age: 2 };

    const result = validator.validate(input);

    expect(result).toEqual({
      success: true,
      data: input,
    });
  });

  it('debe retornar success: false si hay errores de validación', () => {
    const input = { name: 'Gael', age: -1 };

    const result = validator.validate(input);

    expect(result.success).toBe(false);
    expect(result).toHaveProperty('errors');
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('debe retornar múltiples errores si faltan varios campos', () => {
    const input = {}; // objeto vacío

    const result = validator.validate(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.stringContaining('Required'),
      ]));
    }
  });
});
