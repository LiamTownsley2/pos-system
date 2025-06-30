import { getDatabase } from '..'
import { BalanceMovement } from '../../../types/balance_movement'
import { v7 as uuidv7 } from 'uuid'

// Create
export function createBalanceMovement(
  balance_movement: Omit<BalanceMovement, 'id' | 'created_at'>
): BalanceMovement {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO balance_movements (id, member_id, type, amount, created_at)
            VALUES (?, ?, ?, ?, strftime('%s','now'))
        `
  ).run(_id, balance_movement.member_id, balance_movement.type, balance_movement.amount)
  return getBalanceMovementById(_id)!
}

// Read (single)
export function getBalanceMovementById(id: string): BalanceMovement | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM balance_movements WHERE id = ?`).get(id) as
    | BalanceMovement
    | undefined
}
// Read (all)
export function getAllBalanceMovements(): BalanceMovement[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM balance_movements`).all() as BalanceMovement[]
}
