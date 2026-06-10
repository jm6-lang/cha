import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      // 把历史遗留的 @/static/styles 路径映射到 @/styles
      '@/static/styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  server: {
    port: 9000,
    proxy: {
      // API 代理 → Cloudflare Worker 本地开发（wrangler dev 默认 8787 端口）
      // Worker 路由是 /api/tianapi/* 和 /api/marriage/*，保持 /api 前缀
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
});
