<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <div class="toast" :class="{ show: visible }">{{ message }}</div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-80px);
  background: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  z-index: 300;
  transition: transform 0.25s;
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
}
.toast.show {
  transform: translateX(-50%) translateY(0);
}
</style>
