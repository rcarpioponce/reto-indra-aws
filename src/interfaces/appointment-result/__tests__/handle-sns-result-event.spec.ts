import { handleSnsResultEvent } from '../handle-sns-result-event';
import * as parseSnsModule from '../../../shared/utils/parse-sns-message';
import * as parseMessageModule from '../../../shared/utils/parse-message';
import { SaveResultUseCase } from '../../../application/usecases/save-result.usecase';

jest.mock('../../../application/usecases/save-result.usecase');
jest.mock('../../../infrastructure/result/result-dynamo.repository');

describe('handleSnsResultEvent', () => {
  const validInput = {
    insuredId: '12345',
    scheduleId: 789,
    countryISO: 'PE',
  };

  const record = (message: string) => ({
    body: JSON.stringify({ Message: message }),
  });

  const event = {
    Records: [record(JSON.stringify(validInput))],
  };

  let mockExecute: jest.Mock;

  beforeEach(() => {
    mockExecute = jest.fn();
    (SaveResultUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('procesa un mensaje válido y guarda el resultado', async () => {
    jest
      .spyOn(parseSnsModule, 'parseSnsMessage')
      .mockReturnValue(validInput);

    jest
      .spyOn(parseMessageModule, 'parseMessage')
      .mockReturnValue({...validInput, countryISO: 'PE' as 'PE' | 'CL'});

    await handleSnsResultEvent(event as any);

    expect(mockExecute).toHaveBeenCalledWith({
      ...validInput,
      id: '12345-789',
      status: 'SUCCESS',
    });
  });

  it('omite el mensaje si parseSnsMessage retorna null', async () => {
    jest
      .spyOn(parseSnsModule, 'parseSnsMessage')
      .mockReturnValue(null);

    await handleSnsResultEvent(event as any);

    expect(mockExecute).not.toHaveBeenCalled();
  });

  it('captura error si parseMessage lanza excepción', async () => {
    jest
      .spyOn(parseSnsModule, 'parseSnsMessage')
      .mockReturnValue(validInput);

    jest
      .spyOn(parseMessageModule, 'parseMessage')
      .mockImplementation(() => {
        throw new Error('parse error');
      });

    await handleSnsResultEvent(event as any);

    expect(mockExecute).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error procesando el mensaje:',
      expect.any(Error)
    );
  });

  it('captura error si useCase.execute lanza excepción', async () => {
    jest
      .spyOn(parseSnsModule, 'parseSnsMessage')
      .mockReturnValue(validInput);

    jest
      .spyOn(parseMessageModule, 'parseMessage')
      .mockReturnValue({...validInput, countryISO: 'PE' as 'PE' | 'CL'});

    mockExecute.mockRejectedValue(new Error('dynamo error'));

    await handleSnsResultEvent(event as any);

    expect(console.error).toHaveBeenCalledWith(
      'Error procesando el mensaje:',
      expect.any(Error)
    );
  });
});
