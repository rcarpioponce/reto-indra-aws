import { handleSnsResultEvent } from '../handle-sns-result-event';
import { SaveResultUseCase } from '../../../application/usecases/save-result.usecase';
import * as parseSnsMessageModule from '../../../shared/utils/parse-sns-message';
import * as parseMessageModule from '../../../shared/utils/parse-message';

jest.mock('../../../application/usecases/save-result.usecase');
jest.mock('../../../infrastructure/result/result-dynamo.repository');

describe('handleSnsResultEvent', () => {
  const mockExecute = jest.fn();

  beforeEach(() => {
    (SaveResultUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const snsRecord = (message: string) => ({
    Sns: { Message: message },
  });

  it('procesa un mensaje SNS válido y guarda el resultado', async () => {
    const rawInput = {
      insuredId: '12345',
      scheduleId: 789,
      countryISO: 'PE',
    };

    jest
      .spyOn(parseSnsMessageModule, 'parseSnsMessage')
      .mockReturnValue(rawInput);

    jest
      .spyOn(parseMessageModule, 'parseMessage')
      .mockReturnValue({...rawInput, countryISO: 'PE' as 'PE' | 'CL'});

    await handleSnsResultEvent({
      Records: [snsRecord(JSON.stringify(rawInput))],
    } as any);

    expect(mockExecute).toHaveBeenCalledWith({
      id: '12345-789',
      status: 'SUCCESS',
      insuredId: '12345',
      scheduleId: 789,
      countryISO: 'PE',
    });
  });

  it('omite el mensaje si parseSnsMessage retorna null', async () => {
    jest
      .spyOn(parseSnsMessageModule, 'parseSnsMessage')
      .mockReturnValue(null);

    await handleSnsResultEvent({
      Records: [snsRecord('malformado')],
    } as any);

    expect(mockExecute).not.toHaveBeenCalled();
  });

  it('captura error si parseMessage lanza excepción', async () => {
    jest
      .spyOn(parseSnsMessageModule, 'parseSnsMessage')
      .mockReturnValue({ insuredId: '12345' });

    jest
      .spyOn(parseMessageModule, 'parseMessage')
      .mockImplementation(() => {
        throw new Error('invalid structure');
      });

    await handleSnsResultEvent({
      Records: [snsRecord('{}')],
    } as any);

    expect(mockExecute).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error procesando el mensaje:',
      expect.any(Error)
    );
  });
});
