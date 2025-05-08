import { Appointment } from "../../domain/models/appointment";
import { AppointmentInput } from "../dto/appointment-input.dto";
import { IAppointmentRepository } from "../../domain/repositories/i-appointment-repository";
import { IAppointmentEventPublisher } from "../../domain/events/i-appointment-event-publisher";

export class CreateAppointmentUseCase {
  constructor(
    private readonly repository: IAppointmentRepository,
    private readonly publisher: IAppointmentEventPublisher
  ) {}

  async execute(input: AppointmentInput & { id: string }): Promise<Appointment> {
    const appointment: Appointment = {
      id: input.id, // ✅ usamos el ID externo
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      countryISO: input.countryISO,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await this.repository.save(appointment);

    await this.publisher.publish(input); // también contiene el mismo id

    return appointment;
  }
}
