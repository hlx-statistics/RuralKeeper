import {
  ANALYTICS_STALE_DAYS,
  ANALYTICS_WINDOW_DAYS,
  LOW_STOCK_THRESHOLD,
} from '@/constants/analytics'
import type { Goods, SaleRecord } from '@/types'
import type { GoodsAnalyticsReport, GoodsAnalyticsRow } from '@/types/analytics'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function compareName(a: GoodsAnalyticsRow, b: GoodsAnalyticsRow): number {
  return a.name.localeCompare(b.name, 'zh-CN')
}

function sortByQty(rows: GoodsAnalyticsRow[]): GoodsAnalyticsRow[] {
  return [...rows].sort((a, b) => {
    if (b.qtyInWindow !== a.qtyInWindow) return b.qtyInWindow - a.qtyInWindow
    if (b.amountInWindow !== a.amountInWindow) return b.amountInWindow - a.amountInWindow
    return compareName(a, b)
  })
}

function sortByAmount(rows: GoodsAnalyticsRow[]): GoodsAnalyticsRow[] {
  return [...rows].sort((a, b) => {
    if (b.amountInWindow !== a.amountInWindow) return b.amountInWindow - a.amountInWindow
    if (b.qtyInWindow !== a.qtyInWindow) return b.qtyInWindow - a.qtyInWindow
    return compareName(a, b)
  })
}

export const analyticsService = {
  buildReport(goods: Goods[], sales: SaleRecord[], now = Date.now()): GoodsAnalyticsReport {
    const windowStart = now - ANALYTICS_WINDOW_DAYS * MS_PER_DAY
    const staleCutoff = now - ANALYTICS_STALE_DAYS * MS_PER_DAY

    const windowStats = new Map<string, { qty: number; amount: number }>()
    const lastSaleAt = new Map<string, number>()

    for (const sale of sales) {
      for (const item of sale.items) {
        const prevLast = lastSaleAt.get(item.goodsId)
        if (prevLast === undefined || sale.createdAt > prevLast) {
          lastSaleAt.set(item.goodsId, sale.createdAt)
        }
        if (sale.createdAt >= windowStart && sale.createdAt <= now) {
          const cur = windowStats.get(item.goodsId) ?? { qty: 0, amount: 0 }
          cur.qty += item.quantity
          cur.amount += item.price * item.quantity
          windowStats.set(item.goodsId, cur)
        }
      }
    }

    const rows: GoodsAnalyticsRow[] = goods
      .filter((g) => g.stock > 0)
      .map((g) => {
        const st = windowStats.get(g.id) ?? { qty: 0, amount: 0 }
        const last = lastSaleAt.get(g.id)
        return {
          goodsId: g.id,
          name: g.name,
          barcode: g.barcode,
          stock: g.stock,
          qtyInWindow: st.qty,
          amountInWindow: st.amount,
          suggestRestock: st.qty > 0 && g.stock < LOW_STOCK_THRESHOLD,
          suggestCheckExpiry: last === undefined || last < staleCutoff,
        }
      })

    return {
      byQty: sortByQty(rows),
      byAmount: sortByAmount(rows),
      windowDays: ANALYTICS_WINDOW_DAYS,
      staleDays: ANALYTICS_STALE_DAYS,
    }
  },
}
