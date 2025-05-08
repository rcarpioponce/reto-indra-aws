import { Appointment } from '../../domain/entities/appointment';
import { AppointmentRdsRepository } from '../../domain/repositories/appointment-rds.repository';

export class RegisterAppointmentInRdsUseCase {
  constructor(private readonly repository: AppointmentRdsRepository) {}

  async execute(appointment: Appointment): Promise<void> {
    await this.repository.save(appointment);
  }
}
