import { categoriesRepository } from '@/db/repositories/categories.repository'
import { goodsRepository } from '@/db/repositories/goods.repository'
import { DEFAULT_CATEGORIES } from '@/constants'
import type { Category } from '@/types'
import { createId } from '@/utils/id'

export const categoryService = {
  async list(): Promise<Category[]> {
    return categoriesRepository.getAll()
  },

  async initDefaults(): Promise<void> {
    const existing = await categoriesRepository.getAll()
    if (existing.length > 0) return
    for (const name of DEFAULT_CATEGORIES) {
      await categoriesRepository.add({ id: createId(), name })
    }
  },

  async add(name: string): Promise<Category> {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('EMPTY_NAME')
    const dup = await categoriesRepository.getByName(trimmed)
    if (dup) throw new Error('CATEGORY_EXISTS')
    const category: Category = { id: createId(), name: trimmed }
    await categoriesRepository.add(category)
    return category
  },

  async remove(id: string, name: string): Promise<void> {
    const allGoods = await goodsRepository.getAll()
    for (const g of allGoods) {
      if (g.category === name) {
        await goodsRepository.put({ ...g, category: '其他', updatedAt: Date.now() })
      }
    }
    await categoriesRepository.delete(id)
  },
}
