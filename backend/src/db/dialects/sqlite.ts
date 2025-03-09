import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import { DATABASE_URL } from '@/config/config'

export function initializeSQLite() {
  const client = createClient({
    url: DATABASE_URL,
  })

  return drizzle(client)
}
