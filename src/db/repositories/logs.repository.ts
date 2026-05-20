import { getDb } from '@/db'
import { MAX_LOGS } from '@/constants'
import type { StockLog } from '@/types'

export const logsRepository = {
  async getAll(): Promise<StockLog[]> {
    const db = await getDb()
    const list = await db.getAll('logs')
    return list.sort((a, b) => b.createdAt - a.createdAt)
  },

  async add(log: StockLog): Promise<void> {
    const db = await getDb()
    await db.add('logs', log)
    const all = await this.getAll()
    if (all.length > MAX_LOGS) {
      const toRemove = all.slice(MAX_LOGS)
      const tx = db.transaction('logs', 'readwrite')
      for (const item of toRemove) {
        await tx.store.delete(item.id)
      }
      await tx.done
    }
  },

  async clear(): Promise<void> {
    const db = await getDb()
    await db.clear('logs')
  },
}
