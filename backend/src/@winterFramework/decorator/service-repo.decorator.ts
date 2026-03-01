import { getDb } from '@/db'
import type { DrizzleDB } from 'types/orm.type'

/**
 * Interface implemented by classes decorated with {@link ServiceRepo}.
 * Provides lazy-initialized access to the Drizzle database instance.
 */
export interface DatabaseService {
  db: Promise<DrizzleDB>
}

/**
 * Class decorator that injects a lazy-initialized Drizzle ORM database connection
 * into the decorated class. The database instance is created on first access
 * and reused for subsequent calls.
 *
 * @returns A class decorator function.
 *
 * @example
 * ```ts
 * @ServiceRepo()
 * @RestController('/products')
 * export class ProductController {
 *   async findAll(c: Context) {
 *     const database = await this.db;
 *     const products = await database.select().from(productsTable);
 *     return c.json(products);
 *   }
 * }
 * ```
 */
export function ServiceRepo() {
  return function <T extends new (...args: unknown[]) => object>(constructor: T) {
    return class extends constructor implements DatabaseService {
      private _dbInstance?: DrizzleDB

      get db(): Promise<DrizzleDB> {
        return this.getDbInstance()
      }

      private async getDbInstance(): Promise<DrizzleDB> {
        if (!this._dbInstance) {
          this._dbInstance = await getDb()
        }
        return this._dbInstance
      }
    }
  }
}
