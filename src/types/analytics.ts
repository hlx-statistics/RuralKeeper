export interface GoodsAnalyticsRow {
  goodsId: string
  name: string
  barcode: string
  stock: number
  qtyInWindow: number
  amountInWindow: number
  suggestRestock: boolean
  suggestCheckExpiry: boolean
}

export interface GoodsAnalyticsReport {
  byQty: GoodsAnalyticsRow[]
  byAmount: GoodsAnalyticsRow[]
  windowDays: number
  staleDays: number
}
