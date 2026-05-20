<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'

const props = defineProps<{
  show: boolean
  title?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [barcode: string]
}>()

const code = ref('')
let inputEl: HTMLInputElement | null = null

watch(
  () => props.show,
  async (visible) => {
    if (!visible) {
      code.value = ''
      return
    }
    code.value = ''
    await new Promise((r) => setTimeout(r, 120))
    inputEl?.focus()
  },
)

function onInputRef(el: HTMLInputElement | null) {
  inputEl = el
}

function submit() {
  const trimmed = code.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
}
</script>

<template>
  <AppModal :show="show" :z-index="230" @close="emit('close')">
    <h3>{{ title ?? '手动输入条码' }}</h3>
    <p class="hint">输入包装上的数字条码，无需扫码</p>
    <input
      :ref="(el) => onInputRef(el as HTMLInputElement | null)"
      v-model="code"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      class="barcode-input"
      :placeholder="placeholder ?? '请输入商品条码'"
      @keyup.enter="submit"
    />
    <template #footer>
      <section class="modal-buttons">
        <button type="button" class="btn-secondary" @click="emit('close')">取消</button>
        <button type="button" class="btn-primary" @click="submit">确定</button>
      </section>
    </template>
  </AppModal>
</template>

<style scoped>
h3 {
  margin-bottom: 8px;
  font-size: 18px;
}
.hint {
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 14px;
}
.barcode-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 18px;
  letter-spacing: 0.05em;
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
</style>
