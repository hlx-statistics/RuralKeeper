import { onUnmounted, ref } from 'vue'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { ScanMode } from '@/constants'

type BarcodeCallback = (barcode: string) => void

let reader: BrowserMultiFormatReader | null = null

function getReader(): BrowserMultiFormatReader {
  if (!reader) {
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ])
    hints.set(DecodeHintType.TRY_HARDER, true)
    reader = new BrowserMultiFormatReader(hints)
  }
  return reader
}

export function useScanner() {
  const scanning = ref(false)
  const mode = ref<ScanMode | null>(null)
  let controls: IScannerControls | null = null
  let onDetected: BarcodeCallback | null = null
  let lastEmitted = ''
  let lastEmittedAt = 0

  async function start(
    video: HTMLVideoElement,
    scanMode: ScanMode,
    callback: BarcodeCallback,
  ) {
    await stop()
    mode.value = scanMode
    onDetected = callback
    lastEmitted = ''
    lastEmittedAt = 0

    try {
      controls = await getReader().decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        video,
        (result) => {
          if (!result || !onDetected) return
          const text = result.getText()?.trim()
          if (!text) return

          const now = Date.now()
          if (text === lastEmitted && now - lastEmittedAt < 800) return
          lastEmitted = text
          lastEmittedAt = now

          onDetected(text)
        },
      )
      scanning.value = true
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      alert(`无法打开摄像头：${msg}`)
    }
  }

  async function stop() {
    scanning.value = false
    if (controls) {
      controls.stop()
      controls = null
    }
    mode.value = null
    onDetected = null
  }

  onUnmounted(() => {
    void stop()
  })

  return { scanning, mode, start, stop }
}
