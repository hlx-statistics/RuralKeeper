/** 正式包空库时的三条示例商品（条码参考库 public/barcode-ref.jsonl） */
export const RELEASE_SEED_GOODS = [
  {
    barcode: '6902083893019',
    name: '娃哈哈杏仁紫八宝粥 360克/瓶',
    price: 4,
    cost: 0,
    stock: 10,
    category: '食品',
    remark: '',
  },
  {
    barcode: '6920152439005',
    name: '康师傅酸菜牛肉面袋装 面饼+配料114克/包',
    price: 2.5,
    cost: 0,
    stock: 10,
    category: '食品',
    remark: '',
  },
  {
    barcode: '6921168520015',
    name: '农夫山泉天然水1.5L',
    price: 2.8,
    cost: 0,
    stock: 10,
    category: '饮料',
    remark: '',
  },
] as const
