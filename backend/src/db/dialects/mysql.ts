import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

import { DATABASE_URL } from '@/config/config'

export function initializeMySQL() {
  const pool = mysql.createPool(DATABASE_URL)

  return drizzle(pool)
}
