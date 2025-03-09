import { dbConfig } from '@/config/config'

import { initializePostgres } from './dialects/postgres'
import { initializeMySQL } from './dialects/mysql'
import { initializeSQLite } from './dialects/sqlite'
import type { DrizzleDB } from 'types/orm.type'

let db: DrizzleDB | null = null
let initialized = false

export async function initializeDatabase(): Promise<DrizzleDB> {
  if (initialized && db) return db

  switch (dbConfig.dialect) {
    case 'postgresql':
    case 'gel':
      db = initializePostgres()
      break
    case 'mysql':
    case 'singlestore':
      db = initializeMySQL()
      break
    case 'sqlite':
    case 'turso':
      db = initializeSQLite()
      break
    default:
      throw new Error(`Unsupported dialect: ${dbConfig.dialect}`)
  }

  initialized = true
  return db
}

export async function getDb(): Promise<DrizzleDB> {
  return db || initializeDatabase()
}

export { db }
