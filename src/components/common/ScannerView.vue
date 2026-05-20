<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  compact?: boolean
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

defineExpose({
  getVideoEl: () => videoEl.value,
})
</script>

<template>
  <div class="scanner-container" :class="{ compact }">
    <video ref="videoEl" playsinline autoplay muted />
    <div class="scan-overlay" />
  </div>
</template>

<style scoped>
.scanner-container {
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16 / 10;
  margin-bottom: 10px;
}
.scanner-container.compact {
  aspect-ratio: 16 / 9;
  max-height: 160px;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.scan-overlay {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(43, 94, 59, 0.6);
  margin: 12% 8%;
  border-radius: 8px;
  pointer-events: none;
}
</style>
