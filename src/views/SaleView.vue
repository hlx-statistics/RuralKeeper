<script setup lang="ts">
defineOptions({ name: 'SaleView' })

import { nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ScannerView from '@/components/common/ScannerView.vue'
import ManualBarcodeModal from '@/components/common/ManualBarcodeModal.vue'
import CartList from '@/components/sale/CartList.vue'
import SaleFooter from '@/components/sale/SaleFooter.vue'
import { useSaleCart } from '@/composables/useSaleCart'
import { useScanner } from '@/composables/useScanner'
import { useScanFlash } from '@/composables/useScanFlash'
import { useToast } from '@/composables/useToast'
import { SCAN_DEBOUNCE_MS, ScanMode, AppRoute } from '@/constants'
import { goodsService } from '@/services/goods.service'
import { saleService } from '@/services/sale.service'
import { useAppStore } from '@/stores/app.store'
import { formatMoney } from '@/utils/format'

const router = useRouter()
const store = useAppStore()
const { show } = useToast()
const { flash } = useScanFlash()
const { start, stop } = useScanner()
const { cart, totals, isEmpty, addGoods, changeQty, removeLine, clear } = useSaleCart()

const scannerRef = ref<InstanceType<typeof ScannerView> | null>(null)
const showManualInput = ref(false)
let lastBarcode = ''
let lastScanTime = 0

async function startSaleScanner(retry = 0) {
  await nextTick()
  const video = scannerRef.value?.getVideoEl()
  if (!video) {
    if (retry < 8) setTimeout(() => void startSaleScanner(retry + 1), 80)
    return
  }
  await start(video, ScanMode.Sale, (barcode) => {
    void handleSaleBarcode(barcode)
  })
}

async function handleSaleBarcode(barcode: string, force = false) {
  const now = Date.now()
  if (!force && barcode === lastBarcode && now - lastScanTime < SCAN_DEBOUNCE_MS) return
  lastBarcode = barcode
  lastScanTime = now
  flash()

  const goods = await goodsService.getByBarcode(barcode)
  if (goods) {
    addGoods(goods)
    show(`已加入：${goods.name}`)
  } else {
    const addNew = confirm(`未找到条码「${barcode}」\n是否添加新商品？`)
    if (addNew) {
      await stop()
      router.push({ name: AppRoute.Goods, query: { barcode } })
    }
  }
}

async function openManualInput() {
  await stop()
  showManualInput.value = true
}

function closeManualInput() {
  showManualInput.value = false
  void startSaleScanner()
}

async function onManualSubmit(code: string) {
  showManualInput.value = false
  await handleSaleBarcode(code, true)
  void startSaleScanner()
}

function clearCart() {
  if (!isEmpty.value && !confirm('清空当前销售单？')) return
  clear()
}

async function confirmSale() {
  if (isEmpty.value) return
  try {
    const shortages = await saleService.checkShortages(cart.value)
    if (shortages.length) {
      alert(
        '库存不足，无法售出：\n' +
          shortages.map((s) => `${s.name}（需要${s.required}，库存${s.available}）`).join('\n'),
      )
      return
    }
    const { totalQty, totalAmount } = totals.value
    if (!confirm(`共 ${totalQty} 件，合计 ¥${formatMoney(totalAmount)}\n确认售出？`)) return

    await saleService.confirmSale(cart.value)
    clear()
    await store.refreshAll()
    show('售出成功！')
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('INSUFFICIENT_STOCK:')) {
      alert('库存不足，无法售出：\n' + e.message.replace('INSUFFICIENT_STOCK:', ''))
    }
  }
}

onMounted(() => {
  void startSaleScanner()
})

onActivated(() => {
  void startSaleScanner()
})

onDeactivated(() => {
  void stop()
})

onUnmounted(() => {
  void stop()
})
</script>

<template>
  <div class="page sale-page">
    <header class="page-header">
      <h1 class="page-title">销售结账</h1>
    </header>

    <ScannerView ref="scannerRef" compact />
    <p class="scan-tip">对准条码，扫一件加一件 · 顾客请扫您的收款码付款</p>

    <section class="sale-toolbar">
      <button type="button" class="btn-secondary" @click="openManualInput">
        ✏️ 手动输入条码
      </button>
      <button type="button" class="btn-secondary" @click="clearCart">🗑️ 清空</button>
    </section>

    <CartList
      :items="cart"
      @minus="(i) => changeQty(i, -1)"
      @plus="(i) => changeQty(i, 1)"
      @remove="removeLine"
    />

    <SaleFooter
      v-if="!isEmpty"
      :total-qty="totals.totalQty"
      :total-amount="totals.totalAmount"
      @confirm="confirmSale"
    />

    <ManualBarcodeModal
      :show="showManualInput"
      @close="closeManualInput"
      @submit="onManualSubmit"
    />
  </div>
</template>

<style scoped>
.sale-page {
  padding-bottom: 140px;
}
.scan-tip {
  text-align: center;
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 8px;
}
.sale-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.sale-toolbar button {
  flex: 1;
}
</style>
