import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"

console.log(import.meta.env);
console.log(process.env.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    open: 'http://localhost:5173/'
  },
  plugins: [
    vue(),
    WindiCSS(),
  ],
})
