import { getDb } from '@/db'
import type { Category } from '@/types'

export const categoriesRepository = {
  async getAll(): Promise<Category[]> {
    const db = await getDb()
    return db.getAll('categories')
  },

  async getByName(name: string): Promise<Category | undefined> {
    const db = await getDb()
    return db.getFromIndex('categories', 'name', name)
  },

  async add(category: Category): Promise<void> {
    const db = await getDb()
    await db.add('categories', category)
  },

  async delete(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('categories', id)
  },
}
