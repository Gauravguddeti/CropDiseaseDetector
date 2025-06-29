import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    // Improve dev server performance
    hmr: {
      overlay: false
    },
    // Enable faster dependency scanning
    fs: {
      strict: false
    }
  },
  build: {
    // Optimize chunk size for better loading performance
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split code into smaller chunks
        manualChunks: {
          // Split React and related libraries into their own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split Material UI into its own chunk
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          // Split TensorFlow into its own chunk (loaded on demand)
          'tensorflow': ['@tensorflow/tfjs']
        }
      }
    },
    // Minify output for production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.logs in production
        drop_console: true,
      },
    }
  },
  // Optimize dependencies for faster dev server startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
    // Include TensorFlow for proper module resolution
    force: true
  },
  define: {
    // Define global for compatibility
    global: 'globalThis'
  },
  // Enable faster builds
  esbuild: {
    target: 'es2020'
  }
})
