import { z } from "zod";
export const AppointmentInputSchema = z.object({
  insuredId: z
    .string({
      required_error: "insuredId es obligatorio",
      invalid_type_error: "insuredId debe ser una cadena de texto",
    })
    .regex(/^\d{5}$/, "insuredId debe tener exactamente 5 dígitos numéricos"),
  scheduleId: z
    .number({
      required_error: "scheduleId es obligatorio",
      invalid_type_error: "scheduleId debe ser un número",
    })
    .int()
    .positive("scheduleId debe ser mayor que 0"),
  countryISO: z.enum(["PE", "CL"], {
    errorMap: () => ({ message: "countryISO debe ser 'PE' o 'CL'" }),
  }),
});

export type AppointmentInput = z.infer<typeof AppointmentInputSchema>;
