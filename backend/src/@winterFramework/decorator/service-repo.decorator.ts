/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb } from '@/db'
import type { DrizzleDB } from 'types/orm.type'

export interface DatabaseService {
  db: Promise<DrizzleDB>
}

export function ServiceRepo() {
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
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
