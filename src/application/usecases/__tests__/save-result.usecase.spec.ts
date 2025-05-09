import { SaveResultUseCase } from '../save-result.usecase';
import { IResultRepository } from '../../../domain/repositories/i-result-repository';
import { AppointmentResult } from '../../../domain/models/appointment-result';

describe('SaveResultUseCase', () => {
  let mockRepository: jest.Mocked<IResultRepository>;
  let useCase: SaveResultUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
    };

    useCase = new SaveResultUseCase(mockRepository);
  });

  it('debe guardar el resultado correctamente', async () => {
    const input: AppointmentResult = {
      id: 'result-123',
      insuredId: '11111',
      scheduleId: 222,
      countryISO: 'PE',
      status: 'SUCCESS',
    };

    await useCase.execute(input);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(input);
  });
});
