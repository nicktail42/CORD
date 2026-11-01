import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', headless: true, reducedMotion: 'reduce' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
})
