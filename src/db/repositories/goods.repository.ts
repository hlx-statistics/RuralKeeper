import { getDb } from '@/db'
import type { Goods } from '@/types'

export const goodsRepository = {
  async getAll(): Promise<Goods[]> {
    const db = await getDb()
    return db.getAll('goods')
  },

  async getById(id: string): Promise<Goods | undefined> {
    const db = await getDb()
    return db.get('goods', id)
  },

  async getByBarcode(barcode: string): Promise<Goods | undefined> {
    const db = await getDb()
    return db.getFromIndex('goods', 'barcode', barcode)
  },

  async add(goods: Goods): Promise<void> {
    const db = await getDb()
    await db.add('goods', goods)
  },

  async put(goods: Goods): Promise<void> {
    const db = await getDb()
    await db.put('goods', goods)
  },

  async delete(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('goods', id)
  },
}
