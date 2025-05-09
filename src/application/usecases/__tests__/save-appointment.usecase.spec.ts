import { SaveAppointmentUseCase } from '../save-appointment.usecase';
import { IAppointmentRepository } from '../../../domain/repositories/i-appointment-repository';
import { Appointment } from '../../../domain/models/appointment';

describe('SaveAppointmentUseCase', () => {
  let mockRepository: jest.Mocked<IAppointmentRepository>;
  let useCase: SaveAppointmentUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      updateStatus: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    useCase = new SaveAppointmentUseCase(mockRepository);
  });

  it('debe guardar la cita correctamente', async () => {
    const appointment: Appointment = {
      id: 'uuid-xyz',
      insuredId: '98765',
      scheduleId: 123,
      countryISO: 'PE',
      status: 'pending',
      createdAt: '2025-05-08T18:00:00.000Z',
    };

    await useCase.execute(appointment);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(appointment);
  });
});
