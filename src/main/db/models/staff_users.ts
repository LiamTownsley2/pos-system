import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'
import { StaffUser } from '../../../types/staff_users'

// Create
export function createStaffUser(
  user: Omit<
    StaffUser,
    | 'id'
    | 'created_at'
    | 'must_reset_password'
    | 'twofa_enabled'
    | 'twofa_secret'
    | 'twofa_backup_codes'
    | 'password_last_changed'
  >
): StaffUser {
  const db = getDatabase()

  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO staff_users (
                id, username, forename, surname, password_hash
            )
            VALUES (?, ?, ?, ?, ?)
        `
  ).run(_id, user.username, user.forename, user.surname, user.password_hash)
  return getStaffUserById(_id)!
}

// Read (single)
export function getStaffUserById(id: string): StaffUser | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM staff_users WHERE id = ?`).get(id) as StaffUser | undefined
}

// Read (by username)
export function getStaffUserByUsername(username: string): StaffUser | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM staff_users WHERE username = ?`).get(username) as
    | StaffUser
    | undefined
}

// Read (all)
export function listStaffUsers(): StaffUser[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM staff_users`).all() as StaffUser[]
}

// Update
export function updateStaffUser(
  id: string,
  updates: Partial<Omit<StaffUser, 'id' | 'created_at'>>
): StaffUser | undefined {
  const allowedKeys: (keyof typeof updates)[] = [
    'username',
    'forename',
    'surname',
    'password_hash',
    'password_last_changed',
    'must_reset_password',
    'twofa_enabled',
    'twofa_secret',
    'twofa_backup_codes'
  ]
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || typeof value === 'number' || value === null) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getStaffUserById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE staff_users SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getStaffUserById(id)
}

// Delete
export function deleteStaffUser(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM staff_users WHERE id = ?`).run(id)
  return result.changes > 0
}
