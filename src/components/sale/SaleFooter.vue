<script setup lang="ts">
import { formatMoney } from '@/utils/format'

defineProps<{
  totalQty: number
  totalAmount: number
}>()

defineEmits<{ confirm: [] }>()
</script>

<template>
  <div class="sale-footer">
    <div class="sale-summary">
      <span>共 <strong>{{ totalQty }}</strong> 件</span>
      <span class="sale-total">¥{{ formatMoney(totalAmount) }}</span>
    </div>
    <button type="button" class="btn-primary confirm-btn" @click="$emit('confirm')">确认售出</button>
    <p class="payment-hint">收款在 App 外完成（支付宝/微信商家码）</p>
  </div>
</template>

<style scoped>
.sale-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--tab-height);
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  z-index: 105;
  max-width: var(--max-width);
  margin: 0 auto;
}
.sale-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}
.sale-total {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
}
.confirm-btn {
  width: 100%;
  padding: 14px;
}
.payment-hint {
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  margin-top: 8px;
}
</style>
