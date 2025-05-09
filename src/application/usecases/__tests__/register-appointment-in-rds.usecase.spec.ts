import { RegisterAppointmentInRdsUseCase } from '../register-appointment-in-rds.usecase';
import { AppointmentRdsRepository } from '../../../domain/repositories/appointment-rds.repository';
import { Appointment } from '../../../domain/entities/appointment';

describe('RegisterAppointmentInRdsUseCase', () => {
  let mockRepository: jest.Mocked<AppointmentRdsRepository>;
  let useCase: RegisterAppointmentInRdsUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
    };

    useCase = new RegisterAppointmentInRdsUseCase(mockRepository);
  });

  it('debe guardar la cita en RDS correctamente', async () => {
    const appointment: Appointment = {
      id: 'uuid-abc',
      insuredId: '12345',
      scheduleId: 100,
    };

    await useCase.execute(appointment);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(appointment);
  });
});
