import { goodsRepository } from '@/db/repositories/goods.repository'
import { logsRepository } from '@/db/repositories/logs.repository'
import { salesRepository } from '@/db/repositories/sales.repository'
import type { SaleItem, SaleRecord } from '@/types'
import { createId } from '@/utils/id'

export interface CartTotals {
  totalQty: number
  totalAmount: number
}

export interface StockShortage {
  name: string
  required: number
  available: number
}

export const saleService = {
  calcTotals(cart: SaleItem[]): CartTotals {
    let totalQty = 0
    let totalAmount = 0
    for (const line of cart) {
      totalQty += line.quantity
      totalAmount += line.price * line.quantity
    }
    return { totalQty, totalAmount }
  },

  async checkShortages(cart: SaleItem[]): Promise<StockShortage[]> {
    const shortages: StockShortage[] = []
    for (const line of cart) {
      const g = await goodsRepository.getById(line.goodsId)
      const available = g?.stock ?? 0
      if (!g || g.stock < line.quantity) {
        shortages.push({
          name: line.name,
          required: line.quantity,
          available,
        })
      }
    }
    return shortages
  },

  async confirmSale(cart: SaleItem[]): Promise<SaleRecord> {
    const shortages = await this.checkShortages(cart)
    if (shortages.length > 0) {
      throw new Error(
        'INSUFFICIENT_STOCK:' +
          shortages
            .map((s) => `${s.name}（需要${s.required}，库存${s.available}）`)
            .join('\n'),
      )
    }

    const { totalQty, totalAmount } = this.calcTotals(cart)
    const saleId = createId()
    const record: SaleRecord = {
      id: saleId,
      items: cart.map((l) => ({ ...l })),
      totalQty,
      totalAmount,
      createdAt: Date.now(),
    }

    for (const line of cart) {
      const g = await goodsRepository.getById(line.goodsId)
      if (!g) continue
      const afterStock = g.stock - line.quantity
      await goodsRepository.put({
        ...g,
        stock: afterStock,
        updatedAt: Date.now(),
      })
      await logsRepository.add({
        id: createId(),
        goodsId: g.id,
        type: 'sale',
        quantity: line.quantity,
        beforeStock: g.stock,
        afterStock,
        saleId,
        createdAt: Date.now(),
      })
    }

    await salesRepository.add(record)
    return record
  },

  async listRecords(): Promise<SaleRecord[]> {
    return salesRepository.getAll()
  },
}
