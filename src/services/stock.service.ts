import { goodsRepository } from '@/db/repositories/goods.repository'
import { logsRepository } from '@/db/repositories/logs.repository'
import type { Goods, LogType } from '@/types'
import { createId } from '@/utils/id'

async function writeLog(
  goods: Goods,
  type: LogType,
  quantity: number,
  afterStock: number,
  saleId?: string,
  remark?: string,
): Promise<void> {
  await logsRepository.add({
    id: createId(),
    goodsId: goods.id,
    type,
    quantity,
    beforeStock: goods.stock,
    afterStock,
    saleId,
    remark,
    createdAt: Date.now(),
  })
}

export const stockService = {
  async stockIn(goodsId: string, quantity: number, remark?: string): Promise<Goods> {
    const goods = await goodsRepository.getById(goodsId)
    if (!goods) throw new Error('NOT_FOUND')
    if (quantity <= 0) throw new Error('INVALID_QTY')

    const afterStock = goods.stock + quantity
    const updated: Goods = { ...goods, stock: afterStock, updatedAt: Date.now() }
    await goodsRepository.put(updated)
    await writeLog(goods, 'in', quantity, afterStock, undefined, remark)
    return updated
  },

  async stockOut(goodsId: string, quantity: number, remark?: string): Promise<Goods> {
    const goods = await goodsRepository.getById(goodsId)
    if (!goods) throw new Error('NOT_FOUND')
    if (quantity <= 0) throw new Error('INVALID_QTY')
    if (goods.stock < quantity) throw new Error('INSUFFICIENT_STOCK')

    const afterStock = goods.stock - quantity
    const updated: Goods = { ...goods, stock: afterStock, updatedAt: Date.now() }
    await goodsRepository.put(updated)
    await writeLog(goods, 'out', quantity, afterStock, undefined, remark)
    return updated
  },
}
