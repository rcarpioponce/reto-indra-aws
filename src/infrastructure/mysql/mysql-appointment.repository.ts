import { AppointmentRdsRepository } from '../../domain/repositories/appointment-rds.repository';
import { Appointment } from '../../domain/entities/appointment';
import { getMySQLConnection } from './mysql-connection';

export class MySQLAppointmentRepository implements AppointmentRdsRepository {
  constructor(private readonly countryISO: 'PE' | 'CL') {}

  async save(appointment: Appointment): Promise<void> {
    const connection = await getMySQLConnection(this.countryISO);

    const query = `
      INSERT INTO appointments (id, insured_id, schedule_id, created_at)
      VALUES (?, ?, ?, NOW())
    `;

    await connection.execute(query, [
      appointment.id,
      appointment.insuredId,
      appointment.scheduleId,
    ]);

    await connection.end();
  }
}
