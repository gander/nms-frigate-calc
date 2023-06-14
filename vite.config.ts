import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __APP_VERSION__: process.env.NODE_ENV === 'production' ? packageJson.version : JSON.stringify(packageJson.version),
  },
})
