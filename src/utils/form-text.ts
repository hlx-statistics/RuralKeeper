/** 表单字段统一转字符串（避免 number 输入框 v-model 为 number 时 .trim 报错） */
export function asFormText(value: unknown): string {
  return String(value ?? '').trim()
}
