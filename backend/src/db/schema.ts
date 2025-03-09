import { type Config } from 'drizzle-kit'

// PostgreSQL imports
import {
  integer as pgInteger,
  text as pgText,
  varchar as pgVarchar,
  timestamp as pgTimestamp,
  pgTable,
} from 'drizzle-orm/pg-core'

// MySQL imports
import {
  int as mysqlInt,
  text as mysqlText,
  varchar as mysqlVarchar,
  timestamp as mysqlTimestamp,
  datetime as mysqlDatetime,
  mysqlTable,
} from 'drizzle-orm/mysql-core'

// SQLite imports
import {
  integer as sqliteInteger,
  text as sqliteText,
  sqliteTable,
} from 'drizzle-orm/sqlite-core'

import { dbConfig } from '@/config/config'

// Example schema for each dialect implementation
export function defineUsersTable(dialect: Config['dialect']) {
  switch (dialect) {
    case 'postgresql':
    case 'gel':
      return pgTable('users', {
        id: pgInteger('id').primaryKey(),
        name: pgText('name').notNull(),
        email: pgText('email').notNull().unique(),
        password: pgText('password').notNull(),
        email_verified_at: pgTimestamp('email_verified_at', {
          mode: 'date',
        }),
        remember_token: pgVarchar('remember_token', { length: 100 }),
        deleted_at: pgTimestamp('deleted_at', { mode: 'date' }),
        created_at: pgTimestamp('created_at', {
          mode: 'date',
        }).defaultNow(),
        updated_at: pgTimestamp('updated_at', {
          mode: 'date',
        }).defaultNow(),
      })

    case 'mysql':
    case 'singlestore':
      return mysqlTable('users', {
        id: mysqlInt('id').primaryKey().autoincrement(),
        name: mysqlText('name').notNull(),
        email: mysqlText('email').notNull().unique(),
        password: mysqlText('password').notNull(),
        email_verified_at: mysqlTimestamp('email_verified_at'),
        remember_token: mysqlVarchar('remember_token', { length: 100 }),
        deleted_at: mysqlDatetime('deleted_at'),
        created_at: mysqlTimestamp('created_at').defaultNow(),
        updated_at: mysqlTimestamp('updated_at').defaultNow(),
      })

    case 'sqlite':
    case 'turso':
      return sqliteTable('users', {
        id: sqliteInteger('id').primaryKey(),
        name: sqliteText('name').notNull(),
        email: sqliteText('email').notNull().unique(),
        password: sqliteText('password').notNull(),
        email_verified_at: sqliteInteger('email_verified_at'),
        remember_token: sqliteText('remember_token'),
        deleted_at: sqliteText('deleted_at'),
        created_at: sqliteText('created_at'),
        updated_at: sqliteText('updated_at'),
      })

    default:
      throw new Error(`Unsupported dialect for schema: ${dialect}`)
  }
}

export const users = defineUsersTable(dbConfig.dialect)
