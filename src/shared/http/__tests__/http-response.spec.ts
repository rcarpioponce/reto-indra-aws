import {
  respond,
  ok,
  created,
  badRequest,
  internalError,
} from '../http-response';

describe('HTTP response helpers', () => {
  describe('respond()', () => {
    it('retorna el statusCode y el body serializado', () => {
      const result = respond(204, { success: true });
      expect(result).toEqual({
        statusCode: 204,
        body: JSON.stringify({ success: true }),
      });
    });
  });

  describe('ok()', () => {
    it('retorna 200 con el body esperado', () => {
      const data = { id: 1 };
      const result = ok(data);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(data),
      });
    });
  });

  describe('created()', () => {
    it('retorna 201 con mensaje y data', () => {
      const result = created('Recurso creado', { id: 'abc123' });
      expect(result).toEqual({
        statusCode: 201,
        body: JSON.stringify({
          message: 'Recurso creado',
          data: { id: 'abc123' },
        }),
      });
    });
  });

  describe('badRequest()', () => {
    it('retorna 400 con mensaje y errores opcionales', () => {
      const result = badRequest('Error de validación', ['campo requerido']);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: 'Error de validación',
          errors: ['campo requerido'],
        }),
      });
    });

    it('retorna 400 con solo el mensaje si no hay errores', () => {
      const result = badRequest('Petición inválida');
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: 'Petición inválida',
          errors: undefined,
        }),
      });
    });
  });

  describe('internalError()', () => {
    it('retorna 500 con mensaje de error', () => {
      const result = internalError('Algo falló');
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: 'Algo falló' }),
      });
    });
  });
});
