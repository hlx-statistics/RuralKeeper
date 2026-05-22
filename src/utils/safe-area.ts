import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

/** ColorOS 等机型 WebView 常拿不到 env(safe-area-inset-top)，用状态栏高度兜底 */
const ANDROID_TOP_FALLBACK_PX = 36

function applySafeTop(px: number) {
  document.documentElement.style.setProperty('--safe-top', `${px}px`)
}

/**
 * 原生壳：禁止 WebView 绘制到状态栏下，并按实际高度设置 --safe-top。
 * 须在 mount 前调用，避免三页标题与状态栏重叠。
 */
export async function initSafeArea(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  document.documentElement.classList.add('capacitor-native')
  if (Capacitor.getPlatform() === 'android') {
    document.documentElement.classList.add('platform-android')
  }

  try {
    await StatusBar.setOverlaysWebView({ overlay: false })
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#f5f7fb' })

    const info = await StatusBar.getInfo()
    const h =
      info.height && info.height > 0 ? info.height : ANDROID_TOP_FALLBACK_PX
    // ColorOS 等 WebView 常仍全屏绘制，Android 统一用状态栏高度顶出内容
    if (Capacitor.getPlatform() === 'android' || info.overlays) {
      applySafeTop(h)
    } else {
      applySafeTop(0)
    }
  } catch {
    if (Capacitor.getPlatform() === 'android') {
      applySafeTop(ANDROID_TOP_FALLBACK_PX)
    }
  }

  const vv = window.visualViewport
  if (!vv) return

  const syncFromViewport = () => {
    const top = Math.round(vv.offsetTop)
    if (top > 0) applySafeTop(top)
  }
  vv.addEventListener('resize', syncFromViewport)
  vv.addEventListener('scroll', syncFromViewport)
  syncFromViewport()
}
