import { getDb } from '@/db'
import type { SaleRecord } from '@/types'

export const salesRepository = {
  async getAll(): Promise<SaleRecord[]> {
    const db = await getDb()
    const list = await db.getAll('sales')
    return list.sort((a, b) => b.createdAt - a.createdAt)
  },

  async add(record: SaleRecord): Promise<void> {
    const db = await getDb()
    await db.add('sales', record)
  },

  async clear(): Promise<void> {
    const db = await getDb()
    await db.clear('sales')
  },
}
