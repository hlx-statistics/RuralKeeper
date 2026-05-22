/**
 * 经营统计逻辑单元测试（无 DOM，与 analytics.service 规则一致）
 */
const ANALYTICS_WINDOW_DAYS = 30
const ANALYTICS_STALE_DAYS = 60
const LOW_STOCK_THRESHOLD = 5
const MS_PER_DAY = 24 * 60 * 60 * 1000

function buildReport(goods, sales, now = Date.now()) {
  const windowStart = now - ANALYTICS_WINDOW_DAYS * MS_PER_DAY
  const staleCutoff = now - ANALYTICS_STALE_DAYS * MS_PER_DAY
  const windowStats = new Map()
  const lastSaleAt = new Map()

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

  const rows = goods
    .filter((g) => g.stock > 0)
    .map((g) => {
      const st = windowStats.get(g.id) ?? { qty: 0, amount: 0 }
      const last = lastSaleAt.get(g.id)
      return {
        goodsId: g.id,
        name: g.name,
        qtyInWindow: st.qty,
        amountInWindow: st.amount,
        stock: g.stock,
        suggestRestock: st.qty > 0 && g.stock < LOW_STOCK_THRESHOLD,
        suggestCheckExpiry: last === undefined || last < staleCutoff,
      }
    })

  const byQty = [...rows].sort((a, b) => b.qtyInWindow - a.qtyInWindow)
  const byAmount = [...rows].sort((a, b) => b.amountInWindow - a.amountInWindow)
  return { byQty, byAmount }
}

const now = Date.parse('2026-05-23T12:00:00')
const goods = [
  { id: 'a', name: '便宜水', stock: 3, barcode: '1' },
  { id: 'b', name: '贵酒', stock: 10, barcode: '2' },
  { id: 'c', name: '滞销品', stock: 8, barcode: '3' },
  { id: 'd', name: '零库存', stock: 0, barcode: '4' },
]

const sales = [
  {
    id: 's1',
    createdAt: now - 5 * MS_PER_DAY,
    items: [
      { goodsId: 'a', quantity: 50, price: 2 },
      { goodsId: 'b', quantity: 2, price: 100 },
    ],
  },
  {
    id: 's2',
    createdAt: now - 70 * MS_PER_DAY,
    items: [{ goodsId: 'c', quantity: 1, price: 5 }],
  },
]

const r = buildReport(goods, sales, now)

if (r.byQty[0].goodsId !== 'a') throw new Error('数量榜第一应为便宜水')
if (r.byAmount[0].goodsId !== 'b') throw new Error('金额榜第一应为贵酒')
if (r.byQty.find((x) => x.goodsId === 'd')) throw new Error('零库存不应入榜')

const water = r.byQty.find((x) => x.goodsId === 'a')
if (!water.suggestRestock) throw new Error('有销量且库存<5 应建议补货')

const stale = r.byQty.find((x) => x.goodsId === 'c')
if (!stale.suggestCheckExpiry) throw new Error('60天前售出应提示查保质期')

const wine = r.byQty.find((x) => x.goodsId === 'b')
if (wine.suggestCheckExpiry) throw new Error('近期有售不应提示查保质期')

console.log('test-analytics: ok')
