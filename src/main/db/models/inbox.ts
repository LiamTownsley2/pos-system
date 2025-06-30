import { InboxMessage } from '../../../types/inbox_message'
import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'

// CREATE
export function createInbox(
  inbox: Omit<InboxMessage, 'id' | 'created_at' | 'is_deleted'>
): InboxMessage {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `INSERT INTO inbox (id, recipient_id, sender_id, title, content, read_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, strftime('%s','now'))`
  ).run(
    _id,
    inbox.recipient_id,
    inbox.sender_id ?? null,
    inbox.title,
    inbox.content ?? null,
    inbox.read_at ?? null
  )
  return getInboxById(_id)!
}

// READ (by id)
export function getInboxById(id: string): InboxMessage | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM inbox WHERE id = ? AND is_deleted = 0`).get(id) as
    | InboxMessage
    | undefined
}

export function getInboxByRecipientId(id: string): InboxMessage[] | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM inbox WHERE recipient_id = ? AND is_deleted = 0`).all(id) as
    | InboxMessage[]
    | undefined
}

// READ (all, not deleted)
export function getAllInboxes(): InboxMessage[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM inbox WHERE is_deleted = 0`).all() as InboxMessage[]
}

// UPDATE
export function updateInbox(
  id: string,
  updates: Partial<Omit<InboxMessage, 'id' | 'created_at'>>
): InboxMessage | undefined {
  const allowedKeys: (keyof typeof updates)[] = [
    'recipient_id',
    'sender_id',
    'title',
    'content',
    'is_deleted',
    'read_at'
  ]
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || typeof value === 'number') {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getInboxById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE inbox SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getInboxById(id)
}

// DELETE (soft delete)
export function softDeleteInbox(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`UPDATE inbox SET is_deleted = 1 WHERE id = ?`).run(id)
  return result.changes > 0
}

// DELETE (hard delete)
export function hardDeleteInbox(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM inbox WHERE id = ?`).run(id)
  return result.changes > 0
}
