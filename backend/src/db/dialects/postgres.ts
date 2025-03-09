import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import { DATABASE_URL } from '@/config/config'

const { Pool } = pg

export function initializePostgres() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })

  return drizzle(pool)
}
