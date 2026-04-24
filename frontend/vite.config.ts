import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      plugins: [react(), visualizer(), splitVendorChunkPlugin()],
      output: {
        manualChunks: {
          vendor: ["react", "react-router-dom", "react-dom"],
          material: ["@mui/material"],
        },
      },
    },
  },
})
