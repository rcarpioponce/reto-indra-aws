import { container } from '../di-container';
import { CreateAppointmentUseCase } from '../../application/usecases/create-appointment.usecase';
import { AppointmentDynamoRepository } from '../../infrastructure/appointment/appointment-dynamo.repository';
import { SnsAppointmentPublisher } from '../../infrastructure/events/sns-appointment-publisher';

describe('container.resolveCreateAppointmentUseCase', () => {
  it('debe retornar una instancia válida de CreateAppointmentUseCase', () => {
    const useCase = container.resolveCreateAppointmentUseCase();

    expect(useCase).toBeInstanceOf(CreateAppointmentUseCase);

    // Accedemos a las propiedades privadas vía hack de casting para inspección
    const repo = (useCase as any).repository;
    const publisher = (useCase as any).publisher;

    expect(repo).toBeInstanceOf(AppointmentDynamoRepository);
    expect(publisher).toBeInstanceOf(SnsAppointmentPublisher);
  });
});
