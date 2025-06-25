import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  server: mode === 'development' ? {
    port: 3000,
    host: true,
    allowedHosts: true,
    watch: {
      usePolling: true
    }
  } : undefined,
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild for faster minification
    target: 'esnext', // Target modern browsers
  }
}));