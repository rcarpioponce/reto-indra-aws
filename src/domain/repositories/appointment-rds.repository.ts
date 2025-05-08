import { Appointment } from '../entities/appointment';

export interface AppointmentRdsRepository {
  save(appointment: Appointment): Promise<void>;
}
