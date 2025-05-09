import { parseSnsMessage } from '../parse-sns-message';

describe('parseSnsMessage', () => {
  it('retorna el objeto si el mensaje es JSON válido', () => {
    const snsEvent = {
      Message: JSON.stringify({ foo: 'bar', value: 42 }),
    };

    const result = parseSnsMessage(snsEvent);
    expect(result).toEqual({ foo: 'bar', value: 42 });
  });

  it('retorna null si el mensaje no es JSON válido', () => {
    const snsEvent = {
      Message: '{invalidJson:true,}',
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = parseSnsMessage(snsEvent);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error parsing SNS message',
      expect.any(SyntaxError)
    );

    consoleSpy.mockRestore();
  });
});
