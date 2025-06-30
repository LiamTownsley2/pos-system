import { Member } from '../../../types/member'
import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'
import { encode } from 'hi-base32'

// Create
export function createMember(member: Omit<Member, 'id' | 'registered_at'>): Member {
  const db = getDatabase()

  const _id = uuidv7()
  const _short_id = encode(Buffer.from(_id.replace(/-/g, ''), 'hex'))
    .replace(/=+$/, '')
    .slice(0, 10)
    .toUpperCase()
  db.prepare(
    `
            INSERT INTO members (id, short_id, title, forename, surname, email, phone, registered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s','now'))
        `
  ).run(
    _id,
    _short_id,
    member.title,
    member.forename,
    member.surname,
    member.email,
    member.phone ?? null
  )
  return getMemberById(_id)!
}

// Read (single)
export function getMemberById(id: string): Member | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM members WHERE id = ? OR short_id = ?`).get(id, id) as
    | Member
    | undefined
}

// Read (all)
export function getAllMembers(): Member[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM members`).all() as Member[]
}

// Update
export function updateMember(
  id: string,
  updates: Partial<Omit<Member, 'id' | 'registered_at'>>
): Member | undefined {
  const allowedKeys: (keyof typeof updates)[] = ['title', 'forename', 'surname', 'email', 'phone']
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || (key === 'phone' && value !== undefined)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getMemberById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getMemberById(id)
}

// Delete
export function deleteMember(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM members WHERE id = ?`).run(id)
  return result.changes > 0
}
