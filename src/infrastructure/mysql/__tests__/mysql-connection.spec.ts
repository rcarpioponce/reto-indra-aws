import * as mysql from 'mysql2/promise';
import { getMySQLConnection } from '../mysql-connection';

jest.mock('mysql2/promise');

describe('getMySQLConnection', () => {
  const envBackup = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...envBackup }; // Restaurar entorno limpio
  });

  afterAll(() => {
    process.env = envBackup; // Restaurar después de todos los tests
  });

  it('debe crear una conexión MySQL con la configuración de PE', async () => {
    process.env.DB_PE_HOST = 'localhost';
    process.env.DB_PE_PORT = '3306';
    process.env.DB_PE_USER = 'root';
    process.env.DB_PE_PASSWORD = 'secret';
    process.env.DB_PE_NAME = 'appointments_pe';

    const mockConnection = {} as mysql.Connection;
    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

    const result = await getMySQLConnection('PE');

    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'secret',
      database: 'appointments_pe',
    });

    expect(result).toBe(mockConnection);
  });

  it('debe lanzar error si faltan variables de entorno', async () => {
    delete process.env.DB_CL_HOST; // Falta una

    process.env.DB_CL_PORT = '3306';
    process.env.DB_CL_USER = 'root';
    process.env.DB_CL_PASSWORD = 'secret';
    process.env.DB_CL_NAME = 'appointments_cl';

    await expect(getMySQLConnection('CL')).rejects.toThrow(
      '❌ Faltan variables de entorno para la base de datos CL: host'
    );
  });
});
