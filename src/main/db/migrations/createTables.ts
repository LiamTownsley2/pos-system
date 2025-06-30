import { default as BetterSqlite3 } from 'better-sqlite3'

export default function runMigrations(db: BetterSqlite3.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      short_id TEXT,
      title TEXT,
      forename TEXT,
      surname TEXT,
      email TEXT,
      phone TEXT,
      balance REAL,
      registered_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS balance_movements (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      type TEXT CHECK(type IN ('in', 'out')),
      amount REAL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE SET NULL
    );

    CREATE TRIGGER IF NOT EXISTS update_member_balance_after_insert
    AFTER INSERT ON balance_movements
    FOR EACH ROW
    BEGIN
      UPDATE members
      SET balance = balance + 
        CASE NEW.type
          WHEN 'in' THEN NEW.amount
          WHEN 'out' THEN -NEW.amount
        END
      WHERE id = NEW.member_id;
    END;

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT,
      colour TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      unit TEXT,
      price_per_unit REAL,
      category TEXT,
      quantity INTEGER,
      FOREIGN KEY(category) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      type TEXT CHECK(type IN ('in', 'out')),
      quantity INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TRIGGER IF NOT EXISTS update_inventory_quantity_after_insert
    AFTER INSERT ON stock_movements
    BEGIN
      UPDATE products
      SET quantity = quantity + CASE
        WHEN NEW.type = 'in' THEN NEW.quantity
        ELSE -NEW.quantity
      END
      WHERE id = NEW.product_id;
    END;

    CREATE TABLE IF NOT EXISTS user_allotments (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      total REAL,
      prepaid_used REAL,
      cash_paid REAL,
      created_at INTEGER,
      FOREIGN KEY(member_id) REFERENCES members(id)
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id TEXT PRIMARY KEY,
      receipt_id TEXT,
      product_id TEXT,
      name TEXT,
      quantity INTEGER,
      price_per_unit REAL,
      unit TEXT,
      FOREIGN KEY(receipt_id) REFERENCES receipts(id)
    );

    CREATE TABLE IF NOT EXISTS staff_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      forename TEXT NOT NULL,
      surname TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_last_changed INTEGER DEFAULT (strftime('%s','now')),
      must_reset_password INTEGER DEFAULT 1 CHECK(must_reset_password IN (0,1)),
      twofa_enabled INTEGER DEFAULT 0 CHECK(twofa_enabled IN (0,1)),
      twofa_secret TEXT,
      twofa_backup_codes TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

    CREATE TABLE IF NOT EXISTS inbox (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      sender_id TEXT,
      title TEXT NOT NULL,
      content TEXT,
      is_deleted INTEGER DEFAULT 0 CHECK(is_deleted IN (0,1)),
      read_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now'))
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
