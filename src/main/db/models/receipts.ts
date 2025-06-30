import { Receipt, ReceiptItem } from '../../../types/receipts'
import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'

// Create Receipt
export function createReceipt(receipt: Omit<Receipt, 'id' | 'created_at'>): Receipt {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO receipts (id, member_id, total, prepaid_used, cash_paid, created_at)
            VALUES (?, ?, ?, ?, ?, strftime('%s','now'))
        `
  ).run(_id, receipt.member_id ?? null, receipt.total, receipt.prepaid_used, receipt.cash_paid)
  return getReceiptById(_id)!
}

// Read (single)
export function getReceiptById(id: string): Receipt | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM receipts WHERE id = ?`).get(id) as Receipt | undefined
}

// Read (all)
export function getAllReceipts(): Receipt[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM receipts`).all() as Receipt[]
}

// Update
export function updateReceipt(
  id: string,
  updates: Partial<Omit<Receipt, 'id'>>
): Receipt | undefined {
  const allowedKeys: (keyof typeof updates)[] = [
    'member_id',
    'created_at',
    'cash_paid',
    'prepaid_used',
    'total'
  ]
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }
  if (fields.length === 0) return getReceiptById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE receipts SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getReceiptById(id)
}
// Delete
export function deleteReceipt(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM receipts WHERE id = ?`).run(id)
  return result.changes > 0
}

// Receipt Items CRUD

// Create
export function createReceiptItem(item: Omit<ReceiptItem, 'id'>): ReceiptItem {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO receipt_items (id, receipt_id, product_id, name, quantity, price_per_unit, unit)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
  ).run(
    _id,
    item.receipt_id,
    item.product_id,
    item.name,
    item.quantity,
    item.price_per_unit,
    item.unit
  )
  return getReceiptItemById(_id)!
}

// Read (single)
export function getReceiptItemById(id: string): ReceiptItem | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM receipt_items WHERE id = ?`).get(id) as ReceiptItem | undefined
}

// Read (all for a receipt)
export function getReceiptItemsByReceiptId(receipt_id: string): ReceiptItem[] {
  const db = getDatabase()
  return db
    .prepare(`SELECT * FROM receipt_items WHERE receipt_id = ?`)
    .all(receipt_id) as ReceiptItem[]
}

// Update
export function updateReceiptItem(
  id: string,
  updates: Partial<Omit<ReceiptItem, 'id' | 'receipt_id'>>
): ReceiptItem | undefined {
  const allowedKeys: (keyof typeof updates)[] = [
    'product_id',
    'name',
    'quantity',
    'price_per_unit',
    'unit'
  ]
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'number' || typeof value === 'string') {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getReceiptItemById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE receipt_items SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getReceiptItemById(id)
}

// Delete
export function deleteReceiptItem(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM receipt_items WHERE id = ?`).run(id)
  return result.changes > 0
}
