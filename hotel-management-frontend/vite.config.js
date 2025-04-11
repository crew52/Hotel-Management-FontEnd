import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Giữ nguyên cấu trúc thư mục public
    copyPublicDir: true,
    // Không xóa thư mục dist khi build
    emptyOutDir: false,
    // Cấu hình output
    rollupOptions: {
      output: {
        // Giữ nguyên tên file
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
