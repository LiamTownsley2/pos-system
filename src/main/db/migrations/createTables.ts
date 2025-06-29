import { default as BetterSqlite3 } from 'better-sqlite3'

export default function runMigrations(db: BetterSqlite3.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inbox (
      id TEXT PRIMARY KEY,
      staff_id TEXT,
      sender TEXT,
      message TEXT,
      read INTEGER DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      short_id TEXT,
      title TEXT,
      forename TEXT,
      surname TEXT,
      email TEXT,
      phone TEXT,
      registered_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT,
      colour TEXT
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      total_amount REAL,
      created_at INTEGER,
      FOREIGN KEY(member_id) REFERENCES members(id)
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id TEXT PRIMARY KEY,
      receipt_id TEXT,
      product_id TEXT,
      quantity INTEGER,
      price_per_unit REAL,
      FOREIGN KEY(receipt_id) REFERENCES receipts(id)
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      quantity INTEGER,
      price REAL
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      discount_percent REAL,
      bulk_quantity INTEGER,
      start_date INTEGER,
      end_date INTEGER
    );

    CREATE TABLE IF NOT EXISTS promotion_products (
      promotion_id TEXT,
      product_id TEXT,
      PRIMARY KEY(promotion_id, product_id),
      FOREIGN KEY(promotion_id) REFERENCES promotions(id),
      FOREIGN KEY(product_id) REFERENCES inventory(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT,
      target TEXT,
      timestamp INTEGER
    );
  `)
}
