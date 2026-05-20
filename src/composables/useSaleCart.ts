import { computed, ref } from 'vue'
import type { Goods, SaleItem } from '@/types'
import { saleService } from '@/services/sale.service'

const cart = ref<SaleItem[]>([])

export function useSaleCart() {
  const totals = computed(() => saleService.calcTotals(cart.value))
  const isEmpty = computed(() => cart.value.length === 0)

  function addGoods(goods: Goods) {
    const existing = cart.value.find((l) => l.goodsId === goods.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({
        goodsId: goods.id,
        barcode: goods.barcode,
        name: goods.name,
        price: goods.price,
        quantity: 1,
      })
    }
  }

  function changeQty(index: number, delta: number) {
    const line = cart.value[index]
    if (!line) return
    if (delta < 0 && line.quantity <= 1) {
      cart.value.splice(index, 1)
    } else {
      line.quantity += delta
    }
  }

  function removeLine(index: number) {
    cart.value.splice(index, 1)
  }

  function clear() {
    cart.value = []
  }

  return {
    cart,
    totals,
    isEmpty,
    addGoods,
    changeQty,
    removeLine,
    clear,
  }
}
