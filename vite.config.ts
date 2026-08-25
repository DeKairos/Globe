import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Globe Connect',
        short_name: 'GlobeConnect',
        description: 'Interactive 3D globe for country comparison with AI insights',
        theme_color: '#00f2fe',
        background_color: '#050511',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    visualizer({ open: false, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@app-types': path.resolve(__dirname, './src/types'),
      '@data': path.resolve(__dirname, './src/data'),
    },
  },
  build: {
    target: 'es2022',
    minify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('globe.gl') || id.includes('three')) return 'globe-gl';
          if (id.includes('@xenova/transformers') || id.includes('@tensorflow/tfjs')) return 'ai-models';
          if (id.includes('uplot')) return 'charts';
          if (id.includes('date-fns') || id.includes('zod') || id.includes('idb')) return 'utils';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});