import { CreateAppointmentUseCase } from '../create-appointment.usecase';
import { IAppointmentRepository } from '../../../domain/repositories/i-appointment-repository';
import { IAppointmentEventPublisher } from '../../../domain/events/i-appointment-event-publisher';
import { AppointmentInput } from '../../dto/appointment-input.dto';
import { Appointment } from '../../../domain/models/appointment';

describe('CreateAppointmentUseCase', () => {
  let mockRepository: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IAppointmentEventPublisher>;
  let useCase: CreateAppointmentUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      updateStatus: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn(),
    };

    useCase = new CreateAppointmentUseCase(mockRepository, mockPublisher);
  });

  it('debe crear y retornar una cita válida', async () => {
    const input: AppointmentInput & { id: string } = {
      id: 'abc-123',
      insuredId: '98765',
      scheduleId: 456,
      countryISO: 'PE',
    };

    const result = await useCase.execute(input);

    // Validamos estructura del resultado
    expect(result).toMatchObject({
      id: 'abc-123',
      insuredId: '98765',
      scheduleId: 456,
      countryISO: 'PE',
      status: 'pending',
    });

    expect(typeof result.createdAt).toBe('string');

    // Verificamos llamadas a dependencias
    expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: input.id,
      insuredId: input.insuredId,
      status: 'pending',
    }));

    expect(mockPublisher.publish).toHaveBeenCalledWith(input);
  });
});
