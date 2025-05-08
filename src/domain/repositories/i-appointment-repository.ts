import { Appointment } from "../models/appointment";

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  updateStatus(appointment: Appointment): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
}
