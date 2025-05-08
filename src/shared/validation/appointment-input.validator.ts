import { ZodSchema } from "zod";

export class ZodValidator<T> {
  constructor(private schema: ZodSchema<T>) {}

  validate(input: unknown): { success: true; data: T } | { success: false; errors: string[] } {
    const result = this.schema.safeParse(input);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = result.error.errors.map((e) => e.message);
    return { success: false, errors };
  }
}
