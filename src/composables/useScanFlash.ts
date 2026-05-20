import { ref } from 'vue'

const flashOn = ref(false)

export function useScanFlash() {
  function flash() {
    flashOn.value = true
    if (navigator.vibrate) navigator.vibrate(30)
    setTimeout(() => {
      flashOn.value = false
    }, 120)
  }

  return { flashOn, flash }
}
