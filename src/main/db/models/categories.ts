import { Category } from '../../../types/categories'
import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'

// Create
export function createCategory(category: Partial<Omit<Category, 'id'>>): Category {
  const db = getDatabase()

  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO categories (id, name, colour)
            VALUES (?, ?, ?)
        `
  ).run(_id, category.name, category.colour)
  return getCategoryById(_id)!
}

// Read (single)
export function getCategoryById(id: string): Category | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM categories WHERE id = ?`).get(id) as Category | undefined
}

export function getCategoryByName(name: string): Category | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM categories WHERE name = ?`).get(name) as Category | undefined
}

// Read (all)
export function getAllCategories(): Category[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM categories`).all() as Category[]
}

// Update
export function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id'>>
): Category | undefined {
  const allowedKeys: (keyof typeof updates)[] = ['name', 'colour']
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getCategoryById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getCategoryById(id)
}

// Delete
export function deleteCategory(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM categories WHERE id = ?`).run(id)
  return result.changes > 0
}
