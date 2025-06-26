import Database, { Database as DatabaseType } from 'better-sqlite3'
import runMigrations from './migrations/createTables'
import { app } from 'electron'
import { join } from 'path'

const db = new Database(join(app.getPath('userData'), 'app.db'))

runMigrations(db)

export function getDatabase(): DatabaseType {
  return db
}
