import { z } from "zod";

export const AppointmentResultSchema = z.object({
  id: z
    .string()
    .uuid({ message: "id debe ser un UUID válido" }),
  insuredId: z
    .string()
    .regex(/^\d{5}$/, "insuredId debe tener exactamente 5 dígitos numéricos"),
  scheduleId: z
    .number()
    .int()
    .positive("scheduleId debe ser mayor que 0"),
  countryISO: z.enum(["PE", "CL"], {
    errorMap: () => ({ message: "countryISO debe ser 'PE' o 'CL'" }),
  }),
  //status: z.string(),
});

export type AppointmentResult = z.infer<typeof AppointmentResultSchema>;
