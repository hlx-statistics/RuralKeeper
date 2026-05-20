<script setup lang="ts">
import type { SaleItem } from '@/types'
import { formatMoney } from '@/utils/format'

defineProps<{
  items: SaleItem[]
}>()

defineEmits<{
  minus: [index: number]
  plus: [index: number]
  remove: [index: number]
}>()
</script>

<template>
  <div class="cart-list">
    <div v-if="items.length === 0" class="cart-empty">暂无商品，开始扫码吧</div>
    <div v-for="(line, idx) in items" :key="line.goodsId" class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">{{ line.name }}</div>
        <div class="cart-item-meta">¥{{ formatMoney(line.price) }} / 件</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" @click="$emit('minus', idx)">−</button>
        <span class="qty-num">{{ line.quantity }}</span>
        <button class="qty-btn" @click="$emit('plus', idx)">+</button>
      </div>
      <div class="cart-item-sub">¥{{ formatMoney(line.price * line.quantity) }}</div>
      <button class="btn-danger" @click="$emit('remove', idx)">删</button>
    </div>
  </div>
</template>

<style scoped>
.cart-list {
  background: white;
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  min-height: 120px;
  max-height: 42vh;
  overflow-y: auto;
  margin-bottom: 12px;
}
.cart-empty {
  text-align: center;
  padding: 36px 16px;
  color: #aaa;
  font-size: 14px;
}
.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0f0;
  gap: 10px;
}
.cart-item:last-child {
  border-bottom: none;
}
.cart-item-info {
  flex: 1;
  min-width: 0;
}
.cart-item-name {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cart-item-meta {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.cart-item-sub {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 56px;
  text-align: right;
}
.qty-ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: #f8f9fa;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-num {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}
</style>
