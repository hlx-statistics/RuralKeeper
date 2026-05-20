export type LogType = 'in' | 'out' | 'sale'

export interface Goods {
  id: string
  barcode: string
  name: string
  price: number
  cost?: number
  stock: number
  category: string
  remark?: string
  createdAt: number
  updatedAt: number
}

export interface Category {
  id: string
  name: string
}

export interface SaleItem {
  goodsId: string
  barcode: string
  name: string
  price: number
  quantity: number
}

export interface SaleRecord {
  id: string
  items: SaleItem[]
  totalAmount: number
  totalQty: number
  createdAt: number
}

export interface StockLog {
  id: string
  goodsId: string
  type: LogType
  quantity: number
  beforeStock: number
  afterStock: number
  saleId?: string
  remark?: string
  createdAt: number
}

export interface BackupData {
  version: number
  app: string
  date: string
  goods: Goods[]
  categories: Category[]
  sales: SaleRecord[]
  logs?: StockLog[]
}

export type GoodsInput = Omit<Goods, 'id' | 'createdAt' | 'updatedAt'>
