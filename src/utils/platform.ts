import { Capacitor } from '@capacitor/core'

/** 是否运行在 Capacitor 原生壳（Android APK 等） */
export const isNativeApp = Capacitor.isNativePlatform()
