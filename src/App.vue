<script setup lang="ts">
import { onMounted } from 'vue'
import TabBar from '@/components/layout/TabBar.vue'
import AppToast from '@/components/common/AppToast.vue'
import ScanFlash from '@/components/common/ScanFlash.vue'
import { useAppStore } from '@/stores/app.store'

const store = useAppStore()

onMounted(() => {
  void store.bootstrap()
})
</script>

<template>
  <AppToast />
  <ScanFlash />
  <main v-if="store.ready">
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['GoodsView', 'SaleView']">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
  <div v-else class="loading">加载中...</div>
  <TabBar />
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 80px 20px;
  color: #aaa;
}
</style>
