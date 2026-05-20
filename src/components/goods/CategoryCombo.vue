<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Category } from '@/types'
import { UNCATEGORIZED_LABEL } from '@/constants'

const props = defineProps<{
  modelValue: string
  categories: Category[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const query = ref('')
const showList = ref(false)
let blurTimer: ReturnType<typeof setTimeout> | null = null

const trimmedQuery = computed(() => query.value.trim())

const suggestions = computed(() => {
  const q = trimmedQuery.value
  if (!q) return props.categories.slice(0, 12)
  return props.categories.filter((c) => c.name.includes(q)).slice(0, 8)
})

const exactMatch = computed(() =>
  props.categories.find((c) => c.name === trimmedQuery.value),
)

const isNewCategory = computed(
  () => trimmedQuery.value.length > 0 && !exactMatch.value,
)

const statusHint = computed(() => {
  if (!trimmedQuery.value) {
    return '留空表示暂不分类，保存后为「未分类」，可稍后再改'
  }
  if (exactMatch.value) {
    return `已选分类：${exactMatch.value.name}`
  }
  if (suggestions.value.length === 1 && suggestions.value[0].name !== trimmedQuery.value) {
    return `可点选「${suggestions.value[0].name}」，或保存时新建「${trimmedQuery.value}」`
  }
  return `保存时将新建分类「${trimmedQuery.value}」`
})

const statusClass = computed(() => {
  if (!trimmedQuery.value) return 'muted'
  if (exactMatch.value) return 'matched'
  return 'new'
})

watch(
  () => props.modelValue,
  (val) => {
    if (val === UNCATEGORIZED_LABEL || !val) {
      query.value = ''
    } else {
      query.value = val
    }
  },
  { immediate: true },
)

function syncValue(val: string) {
  emit('update:modelValue', val)
}

function onInput() {
  showList.value = true
  if (!trimmedQuery.value) {
    syncValue(UNCATEGORIZED_LABEL)
    return
  }
  if (exactMatch.value) {
    syncValue(exactMatch.value.name)
  } else {
    syncValue(trimmedQuery.value)
  }
}

function onFocus() {
  if (blurTimer) clearTimeout(blurTimer)
  showList.value = true
}

function onBlur() {
  blurTimer = setTimeout(() => {
    showList.value = false
  }, 180)
}

function pick(name: string) {
  query.value = name
  syncValue(name)
  showList.value = false
}

function pickUncategorized() {
  query.value = ''
  syncValue(UNCATEGORIZED_LABEL)
  showList.value = false
}

function clearInput() {
  pickUncategorized()
}
</script>

<template>
  <div class="category-combo">
    <label class="combo-label">
      分类
      <span class="optional">选填</span>
    </label>
    <div class="combo-input-wrap">
      <input
        v-model="query"
        type="text"
        class="combo-input"
        placeholder="输入搜索或新建，留空为未分类"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <button
        v-if="query"
        type="button"
        class="btn-clear"
        aria-label="清空分类"
        @mousedown.prevent="clearInput"
      >
        ×
      </button>
    </div>

    <ul v-if="showList && (suggestions.length || isNewCategory)" class="suggestions">
      <li
        v-for="c in suggestions"
        :key="c.id"
        class="suggestion-item"
        :class="{ active: c.name === trimmedQuery }"
        @mousedown.prevent="pick(c.name)"
      >
        {{ c.name }}
      </li>
      <li v-if="isNewCategory" class="suggestion-new">
        ✨ 将新建分类「{{ trimmedQuery }}」
      </li>
      <li class="suggestion-none" @mousedown.prevent="pickUncategorized">暂不分类</li>
    </ul>

    <p class="status-hint" :class="statusClass">{{ statusHint }}</p>
  </div>
</template>

<style scoped>
.category-combo {
  margin-bottom: 14px;
}
.combo-label {
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}
.optional {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-muted);
  margin-left: 4px;
}
.combo-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.combo-input {
  width: 100%;
  padding: 12px 36px 12px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 16px;
}
.btn-clear {
  position: absolute;
  right: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.suggestions {
  list-style: none;
  margin: 6px 0 0;
  padding: 4px 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-height: 200px;
  overflow-y: auto;
}
.suggestion-item,
.suggestion-new,
.suggestion-none {
  padding: 10px 14px;
  font-size: 15px;
  cursor: pointer;
}
.suggestion-item.active,
.suggestion-item:hover {
  background: #eef5f0;
  color: var(--color-primary);
}
.suggestion-new {
  color: #b45309;
  background: #fffbeb;
  font-size: 13px;
  cursor: default;
}
.suggestion-none {
  color: var(--color-muted);
  font-size: 13px;
  border-top: 1px solid #f0f0f0;
}
.suggestion-none:hover {
  background: #f8f9fa;
}
.status-hint {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.4;
}
.status-hint.muted {
  color: var(--color-muted);
}
.status-hint.matched {
  color: var(--color-primary);
}
.status-hint.new {
  color: #b45309;
}
</style>
