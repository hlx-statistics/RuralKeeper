import { goodsRepository } from '@/db/repositories/goods.repository'
import type { Goods, GoodsInput } from '@/types'
import { createId } from '@/utils/id'

export const goodsService = {
  async list(): Promise<Goods[]> {
    const list = await goodsRepository.getAll()
    return list.sort((a, b) => b.updatedAt - a.updatedAt)
  },

  async getById(id: string): Promise<Goods | undefined> {
    return goodsRepository.getById(id)
  },

  async getByBarcode(barcode: string): Promise<Goods | undefined> {
    return goodsRepository.getByBarcode(barcode)
  },

  async create(input: GoodsInput): Promise<Goods> {
    const existing = await goodsRepository.getByBarcode(input.barcode)
    if (existing) throw new Error('BARCODE_EXISTS')

    const now = Date.now()
    const goods: Goods = {
      ...input,
      id: createId(),
      cost: input.cost ?? 0,
      category: input.category || '未分类',
      remark: input.remark ?? '',
      createdAt: now,
      updatedAt: now,
    }
    await goodsRepository.add(goods)
    return goods
  },

  async update(id: string, updates: Partial<GoodsInput>): Promise<Goods> {
    const goods = await goodsRepository.getById(id)
    if (!goods) throw new Error('NOT_FOUND')

    if (updates.barcode && updates.barcode !== goods.barcode) {
      const dup = await goodsRepository.getByBarcode(updates.barcode)
      if (dup) throw new Error('BARCODE_EXISTS')
    }

    const updated: Goods = {
      ...goods,
      ...updates,
      updatedAt: Date.now(),
    }
    await goodsRepository.put(updated)
    return updated
  },

  async remove(id: string): Promise<void> {
    await goodsRepository.delete(id)
  },

  filter(
    goods: Goods[],
    search: string,
    category: string,
  ): Goods[] {
    let result = goods
    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.barcode.includes(term),
      )
    }
    if (category !== 'all') {
      result = result.filter((g) => g.category === category)
    }
    return result
  },
}
