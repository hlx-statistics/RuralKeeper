<script setup lang="ts">
import { useScanFlash } from '@/composables/useScanFlash'

const { flashOn } = useScanFlash()
</script>

<template>
  <div class="scan-flash" :class="{ on: flashOn }" />
</template>

<style scoped>
.scan-flash {
  position: fixed;
  inset: 0;
  background: rgba(43, 94, 59, 0.15);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 150;
}
.scan-flash.on {
  opacity: 1;
}
</style>
