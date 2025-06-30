import { Category } from '../../../types/categories'
import { Product } from '../../../types/product'
import { getDatabase } from '../index'
import { v7 as uuidv7 } from 'uuid'

// Create
export function createProduct(product: Omit<Product, 'id' | 'quantity'>): Product {
  const db = getDatabase()
  const _id = uuidv7()
  db.prepare(
    `
            INSERT INTO products (id, name, price_per_unit, unit, category, quantity)
            VALUES (?, ?, ?, ?, ?, 0)
        `
  ).run(_id, product.name, product.price_per_unit, product.unit, product.category)
  return getProductById(_id)!
}

// Read (single)
export function getProductById(id: string): Product | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as Product | undefined
}

export function getProductByName(name: string): Product | undefined {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM products WHERE name = ?`).get(name) as Product | undefined
}

// Read (all)
export function getAllProducts(): Category[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM products`).all() as Category[]
}

export function getProductByCategory(category: string): Product[] {
  const db = getDatabase()
  return db.prepare(`SELECT * FROM products WHERE category = ?`).all(category) as Product[]
}

// Update
export function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id'>>
): Product | undefined {
  const allowedKeys: (keyof typeof updates)[] = ['name', 'price_per_unit', 'unit', 'category']
  const fields: string[] = []
  const values: unknown[] = []

  for (const key of allowedKeys) {
    const value = updates[key]
    if (typeof value === 'string' || value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return getProductById(id)

  values.push(id)
  const db = getDatabase()
  db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return getProductById(id)
}

// Delete
export function deleteProduct(id: string): boolean {
  const db = getDatabase()
  const result = db.prepare(`DELETE FROM products WHERE id = ?`).run(id)
  return result.changes > 0
}
