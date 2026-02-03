import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Surgically define only the API_KEY to avoid breaking other process.env lookups (like NODE_ENV)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure the build target is compatible with modern browsers
    target: 'esnext'
  }
});