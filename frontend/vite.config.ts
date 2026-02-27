import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import wails from '@wailsio/runtime/plugins/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 僅在開發模式注入 React DevTools 連線 script（standalone react-devtools，port 8097）
function reactDevToolsPlugin(): Plugin {
  return {
    name: 'react-devtools',
    transformIndexHtml: {
      enforce: 'pre',
      handler(html, ctx) {
        if (ctx.server == null) return html; // vite build 跳過
        return [{ tag: 'script', attrs: { src: 'http://localhost:8097' }, injectTo: 'head-prepend' }];
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactDevToolsPlugin(), react(), wails('./bindings'), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
