<script setup lang="ts">
import { computed, ref } from 'vue'
import { analyticsService } from '@/services/analytics.service'
import { useAppStore } from '@/stores/app.store'
import { formatMoney } from '@/utils/format'
import type { GoodsAnalyticsRow } from '@/types/analytics'

type RankTab = 'qty' | 'amount'

const store = useAppStore()
const activeTab = ref<RankTab>('qty')

const report = computed(() => analyticsService.buildReport(store.goods, store.sales))

const activeList = computed(() =>
  activeTab.value === 'qty' ? report.value.byQty : report.value.byAmount,
)

function metricLabel(row: GoodsAnalyticsRow): string {
  if (activeTab.value === 'qty') {
    return `${row.qtyInWindow} 件`
  }
  return `¥${formatMoney(row.amountInWindow)}`
}
</script>

<template>
  <section class="panel analytics-panel">
    <h4>📊 经营概览</h4>
    <p class="analytics-subtitle">
      近 {{ report.windowDays }} 天 · 仅统计有库存商品 · 列表可上下滑动
    </p>

    <div class="rank-tabs" role="tablist">
      <button
        type="button"
        class="rank-tab"
        :class="{ active: activeTab === 'qty' }"
        role="tab"
        :aria-selected="activeTab === 'qty'"
        @click="activeTab = 'qty'"
      >
        数量排名
      </button>
      <button
        type="button"
        class="rank-tab"
        :class="{ active: activeTab === 'amount' }"
        role="tab"
        :aria-selected="activeTab === 'amount'"
        @click="activeTab = 'amount'"
      >
        金额排名
      </button>
    </div>

    <div v-if="activeList.length === 0" class="muted">暂无有库存商品</div>
    <div v-else class="panel-scroll">
      <ol class="rank-list">
        <li v-for="(row, index) in activeList" :key="row.goodsId" class="rank-item">
          <span class="rank-no">{{ index + 1 }}</span>
          <div class="rank-body">
            <div class="rank-name">{{ row.name }}</div>
            <div class="rank-meta">
              <span class="rank-metric">{{ metricLabel(row) }}</span>
              <span class="rank-stock">库存 {{ row.stock }}</span>
            </div>
            <div v-if="row.suggestRestock || row.suggestCheckExpiry" class="rank-tags">
              <span v-if="row.suggestRestock" class="tag tag-restock">库存偏低，建议补货</span>
              <span v-if="row.suggestCheckExpiry" class="tag tag-stale">
                较久未售出，建议检查保质期
              </span>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.analytics-subtitle {
  font-size: 12px;
  color: #888;
  margin: 4px 0 12px;
}
.rank-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.rank-tab {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 14px;
  cursor: pointer;
}
.rank-tab.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rank-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.rank-item:last-child {
  border-bottom: none;
}
.rank-no {
  flex: 0 0 24px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.4;
}
.rank-body {
  flex: 1;
  min-width: 0;
}
.rank-name {
  font-weight: 600;
  line-height: 1.3;
}
.rank-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.rank-metric {
  color: var(--color-primary);
  font-weight: 600;
}
.rank-tags {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}
.tag {
  font-size: 12px;
  line-height: 1.4;
  padding: 4px 8px;
  border-radius: 6px;
}
.tag-restock {
  background: #fff3e0;
  color: #e65100;
}
.tag-stale {
  background: #fce4ec;
  color: #c62828;
}
.muted {
  color: #aaa;
  font-size: 14px;
}
</style>
