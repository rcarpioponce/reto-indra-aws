import { AppointmentDynamoRepository } from "../infrastructure/appointment/appointment-dynamo.repository";
import { SnsAppointmentPublisher } from "../infrastructure/events/sns-appointment-publisher";
import { CreateAppointmentUseCase } from "../application/usecases/create-appointment.usecase";

export const container = {
  resolveCreateAppointmentUseCase: (): CreateAppointmentUseCase => {
    const repo = new AppointmentDynamoRepository();
    const publisher = new SnsAppointmentPublisher();
    return new CreateAppointmentUseCase(repo, publisher);
  },
};
