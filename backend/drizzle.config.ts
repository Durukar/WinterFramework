import { defineConfig } from 'drizzle-kit'

import { DATABASE_URL, dbConfig } from './src/config/config'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: dbConfig.dialect,
  dbCredentials: {
    url: DATABASE_URL,
  },
})
