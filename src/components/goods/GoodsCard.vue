<script setup lang="ts">
import type { Goods } from '@/types'

defineProps<{ goods: Goods }>()
defineEmits<{
  edit: []
  stockIn: []
  stockOut: []
}>()

function stockClass(stock: number) {
  if (stock <= 0) return 'empty'
  if (stock < 5) return 'low'
  return ''
}
</script>

<template>
  <div class="goods-card">
    <div class="goods-info">
      <div class="goods-name">{{ goods.name }}</div>
      <div class="goods-meta">
        <span>📷 {{ goods.barcode }}</span>
        <span class="price">¥{{ goods.price }}</span>
        <span class="stock" :class="stockClass(goods.stock)">库存 {{ goods.stock }}</span>
        <span>{{ goods.category || '未分类' }}</span>
      </div>
    </div>
    <div class="goods-actions">
      <button class="icon-btn" @click="$emit('edit')">编辑</button>
      <button class="icon-btn" @click="$emit('stockIn')">入库+</button>
      <button class="icon-btn" @click="$emit('stockOut')">出库</button>
    </div>
  </div>
</template>

<style scoped>
.goods-card {
  background: white;
  border-radius: var(--radius-card);
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.goods-info {
  flex: 3;
}
.goods-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}
.goods-meta {
  font-size: 12px;
  color: var(--color-muted);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.price {
  color: var(--color-primary);
  font-weight: 600;
}
.stock.low {
  color: var(--color-warning);
}
.stock.empty {
  color: var(--color-error);
}
.goods-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.icon-btn {
  background: #f8f9fa;
  border: none;
  padding: 8px 10px;
  border-radius: 30px;
  font-size: 13px;
  cursor: pointer;
  min-height: var(--touch-min);
}
</style>
