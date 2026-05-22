<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { AppRoute } from '@/constants'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: AppRoute.Goods, icon: '📦', label: '商品' },
  { key: AppRoute.Sale, icon: '🛒', label: '销售' },
  { key: AppRoute.Profile, icon: '👤', label: '我的' },
]

function go(tab: AppRoute) {
  router.push({ name: tab })
}
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="tab-item"
      :class="{ active: route.name === tab.key }"
      @click="go(tab.key)"
    >
      <i>{{ tab.icon }}</i>
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  padding: 8px 16px calc(12px + var(--safe-bottom));
  border-top: 0.5px solid #ddd;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  max-width: var(--max-width);
  margin: 0 auto;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  border-radius: 30px;
  transition: all 0.2s;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  min-height: var(--touch-min);
}
.tab-item.active {
  background: var(--color-primary);
  color: white;
}
.tab-item i {
  display: block;
  font-size: 22px;
  margin-bottom: 2px;
  font-style: normal;
  font-weight: 600;
}
</style>
