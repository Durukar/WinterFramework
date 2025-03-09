import 'dotenv/config'

import type { Config } from 'drizzle-kit'
import type { Dialect } from 'drizzle-orm'

const supportedDialects: Config['dialect'][] = [
  'postgresql',
  'mysql',
  'sqlite',
  'turso',
  'singlestore',
  'gel',
]

export interface DatabaseConfig {
  dialect: Config['dialect']
  host: string
  port: number
  username: string
  password: string
  database: string
}

const {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env

if (
  !DATABASE_DIALECT ||
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_USERNAME ||
  !DATABASE_NAME
) {
  throw new Error(
    'Missing one or more required environment variables for the database.',
  )
}

if (!supportedDialects.includes(DATABASE_DIALECT as Config['dialect'])) {
  throw new Error(`Unsupported DATABASE_DIALECT: ${DATABASE_DIALECT}`)
}

export const dbConfig: DatabaseConfig = {
  dialect: DATABASE_DIALECT as Config['dialect'],
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD || '',
  database: DATABASE_NAME,
}

export const DATABASE_URL = (() => {
  switch (dbConfig.dialect) {
    case 'postgresql':
      return `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    case 'mysql':
      return `mysql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    case 'sqlite':
      return `file:${dbConfig.database}.sqlite`
    case 'turso':
      return `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    case 'singlestore':
      return `mysql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    case 'gel':
      return `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    default:
      throw new Error(
        `Unsupported dialect for DATABASE_URL construction: ${dbConfig.dialect}`,
      )
  }
})()

export function mapToOrmDialect(kitDialect: Config['dialect']): Dialect {
  const mapping: Record<Config['dialect'], Dialect> = {
    postgresql: 'pg',
    mysql: 'mysql',
    sqlite: 'sqlite',
    turso: 'pg', // Assuming Turso uses PostgreSQL
    singlestore: 'mysql', // Assuming SingleStore uses MySQL
    gel: 'pg', // Adjust based on actual usage
  }

  const ormDialect = mapping[kitDialect]

  if (!ormDialect) {
    throw new Error(`Unsupported drizzle-kit dialect for ORM: ${kitDialect}`)
  }

  return ormDialect
}
