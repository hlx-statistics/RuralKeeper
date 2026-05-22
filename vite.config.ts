import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

/** 正式构建产物不包含演示备份，减小 APK / PWA 体积（debug 同步保留） */
function excludeDemoBackupFromDist(skip: boolean) {
  return {
    name: 'exclude-demo-backup-from-dist',
    apply: 'build' as const,
    closeBundle() {
      if (skip) return
      const file = path.resolve('dist/demo-backup.json')
      try {
        fs.unlinkSync(file)
      } catch {
        /* 无演示文件时忽略 */
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const forNative = mode === 'capacitor' || mode === 'capacitor-debug'
  const useDemoData = mode === 'capacitor-debug'

  return {
    base: forNative ? './' : '/',
    plugins: [
      vue(),
      excludeDemoBackupFromDist(useDemoData),
      VitePWA({
        disable: forNative,
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: '乡程掌柜',
          short_name: '乡程掌柜',
          description: '轻量离线乡村商铺商品与销售管理',
          theme_color: '#2b5e3b',
          background_color: '#f5f7fb',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          icons: [
            {
              src: 'favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,jsonl}'],
          maximumFileSizeToCacheInBytes: 32 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 5173,
    },
  }
})
