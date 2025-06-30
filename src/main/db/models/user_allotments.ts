import { UserAllotmentsLink } from '../../../types/user_allotments'
import { getDatabase } from '../index'

// Create
export function createAllotmentLink(
  alllotment_link: Omit<UserAllotmentsLink, 'created_at'>
): UserAllotmentsLink {
  const db = getDatabase()
  db.prepare(
    `
            INSERT INTO user_allotments (id, member_id, created_at)
            VALUES (?, ?, strftime('%s','now'))
        `
  ).run(alllotment_link.id, alllotment_link.member_id)
  return getAllotmentLinkByGardenId(alllotment_link.id)!
}

// Read (single)
export function getAllotmentLinkByGardenId(id: string): UserAllotmentsLink | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM user_allotments WHERE id = ?`).get(id) as
    | UserAllotmentsLink
    | undefined
}

export function getAllotmentLinkByMemberId(member_id: string): UserAllotmentsLink | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM user_allotments WHERE member_id = ?`).get(member_id) as
    | UserAllotmentsLink
    | undefined
}

// Read (all)
export function getAllAllotmentLinks(): UserAllotmentsLink[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM user_allotments`).all() as UserAllotmentsLink[]
}

// Update
export function updateAllotmentLink(
  id: string,
  updates: Partial<Omit<UserAllotmentsLink, 'created_at'>>
): UserAllotmentsLink | undefined {
  const allowedKeys: (keyof typeof updates)[] = ['id', 'member_id']
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getAllotmentLinkByGardenId(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE user_allotments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getAllotmentLinkByGardenId(id)
}

// Delete
export function deleteAllotmentLink(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM user_allotments WHERE id = ?`).run(id)
  return result.changes > 0
}
