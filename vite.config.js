import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/*
 * public/sw.js 只是模板。這裡把 vite 產生的 hash 檔名寫進 precache 清單，
 * 並用內容決定快取版本，這樣每次部署都會換新快取，不會留下上一版的 asset。
 */
const precacheServiceWorker = () => {
  let emitted = []
  return {
    name: 'precache-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      emitted = Object.keys(bundle).filter(name => name !== 'index.html')
    },
    closeBundle() {
      const outDir = resolve(import.meta.dirname, 'dist')
      const swPath = resolve(outDir, 'sw.js')
      const precache = ['./', './index.html', ...emitted.map(name => `./${name}`)]
      const version = `osaka-2026-${Buffer.from(emitted.join('|')).toString('base64url').slice(0, 12)}`
      const source = readFileSync(swPath, 'utf8')
        .replace('__CACHE_VERSION__', version)
        .replace('__PRECACHE_ASSETS__', JSON.stringify(precache))
      writeFileSync(swPath, source)
    }
  }
}

export default defineConfig({
  base: '/osaka-2026-trip/',
  plugins: [vue(), precacheServiceWorker()]
})
