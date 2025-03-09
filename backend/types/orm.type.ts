import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export type SQLiteDB = LibSQLDatabase
export type MySQLDB = MySql2Database
export type PostgresDB = NodePgDatabase
export type DrizzleDB = SQLiteDB | MySQLDB | PostgresDB

/*
  Usaremos a inserção em tempo de execução em outros momentos no futuro
  para garantir maior complexidade nas querys para os usuarios
  por enquanto deixe comentado e não implemente.
*/
// export function sqLiteClient(db: DrizzleDB): db is SQLiteDB {
//   return 'run' in db
// }
// export function mySqlClient(db: DrizzleDB): db is MySQLDB {
//   return 'execute' in db
// }
// export function postGresClient(db: DrizzleDB): db is PostgresDB {
//   return 'query' in db
// }
