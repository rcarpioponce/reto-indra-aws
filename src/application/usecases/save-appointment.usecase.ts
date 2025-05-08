
import { Appointment } from "../../domain/models/appointment";
import { IAppointmentRepository } from "../../domain/repositories/i-appointment-repository";

export class SaveAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(appointment: Appointment): Promise<void> {
    await this.repository.save(appointment);
  }
}
