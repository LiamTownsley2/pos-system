import { getDatabase } from '..'
import { StockMovement } from '../../../types/stock_movement'
import { v7 as uuidv7 } from 'uuid'

// Create
export function createStockMovement(
  stock_movement: Omit<StockMovement, 'id' | 'created_at'>
): StockMovement {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO stock_movements (id, product_id, type, quantity, created_at)
            VALUES (?, ?, ?, ?, strftime('%s','now'))
        `
  ).run(_id, stock_movement.product_id, stock_movement.type, stock_movement.quantity)
  return getStockMovementById(_id)!
}

// Read (single)
export function getStockMovementById(id: string): StockMovement | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM stock_movements WHERE id = ?`).get(id) as
    | StockMovement
    | undefined
}
// Read (all)
export function getAllStockMovements(): StockMovement[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM stock_movements`).all() as StockMovement[]
}
