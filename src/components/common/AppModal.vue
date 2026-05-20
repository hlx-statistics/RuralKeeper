<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    zIndex?: number
    /** 点击遮罩是否关闭，表单类弹窗建议 false */
    closeOnBackdrop?: boolean
  }>(),
  { zIndex: 200, closeOnBackdrop: true },
)

const emit = defineEmits<{ close: [] }>()

function onBackdropClick() {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal"
      :style="{ zIndex }"
      @click.self="onBackdropClick"
    >
      <div class="modal-panel" @click.stop>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}
.modal-panel {
  background: white;
  width: 100%;
  max-width: var(--max-width);
  max-height: 92vh;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 12px;
  -webkit-overflow-scrolling: touch;
}
.modal-footer {
  flex-shrink: 0;
  padding: 12px 20px calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #eee;
  background: white;
}
</style>
