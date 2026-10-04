import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { giftCardApi } from './server/giftCards.ts'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env } as Record<string, string>;
  const api = giftCardApi(env);
  return { plugins: [react(), tailwindcss(), { name: 'gift-card-api', configureServer(server) { server.middlewares.use(api); }, configurePreviewServer(server) { server.middlewares.use(api); } }] };
})
