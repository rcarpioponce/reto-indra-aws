import mysql, { Connection } from 'mysql2/promise';

type SupportedCountry = 'PE' | 'CL';

interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function resolveDbConfig(country: SupportedCountry): DBConfig {
  const prefix = `DB_${country}_`;

  const config: DBConfig = {
    host: process.env[`${prefix}HOST`] ?? '',
    port: parseInt(process.env[`${prefix}PORT`] ?? '3306', 10),
    user: process.env[`${prefix}USER`] ?? '',
    password: process.env[`${prefix}PASSWORD`] ?? '',
    database: process.env[`${prefix}NAME`] ?? '',
  };

  validateDbConfig(config, country);
  return config;
}

function validateDbConfig(config: DBConfig, country: SupportedCountry): void {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `❌ Faltan variables de entorno para la base de datos ${country}: ${missing.join(', ')}`
    );
  }
}

export async function getMySQLConnection(country: SupportedCountry): Promise<Connection> {
  const config = resolveDbConfig(country);
  return mysql.createConnection(config);
}
