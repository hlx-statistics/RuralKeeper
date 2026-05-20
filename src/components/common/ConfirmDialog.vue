<script setup lang="ts">
import AppModal from '@/components/common/AppModal.vue'

withDefaults(
  defineProps<{
    show: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
    zIndex?: number
  }>(),
  {
    title: '提示',
    confirmText: '确定',
    cancelText: '取消',
    danger: false,
    zIndex: 260,
  },
)

defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <AppModal
    :show="show"
    :z-index="zIndex"
    :close-on-backdrop="false"
    @close="$emit('cancel')"
  >
    <h3>{{ title }}</h3>
    <p class="message">{{ message }}</p>
    <template #footer>
      <section class="modal-buttons">
        <button type="button" class="btn-secondary" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button
          type="button"
          :class="danger ? 'btn-danger' : 'btn-primary'"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </section>
    </template>
  </AppModal>
</template>

<style scoped>
h3 {
  margin-bottom: 12px;
  font-size: 18px;
}
.message {
  font-size: 15px;
  line-height: 1.55;
  color: #333;
  white-space: pre-wrap;
}
.modal-buttons {
  display: flex;
  gap: 12px;
}
.modal-buttons button {
  flex: 1;
  min-height: 48px;
  font-size: 16px;
}
.btn-danger {
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}
</style>
