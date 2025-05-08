import { v4 as uuidv4 } from "uuid";
import { Appointment } from "../../domain/models/appointment";
import { AppointmentResult } from "../../domain/models/appointment-result";

export const processEvent = (result: AppointmentResult): Appointment => {
  return {
    id: result.id,
    insuredId: result.insuredId,
    scheduleId: result.scheduleId,
    countryISO: result.countryISO,
    status: result.status === "SUCCESS" ? "completed" : "pending",
    createdAt: new Date().toISOString(),
  };
};
