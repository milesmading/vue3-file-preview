import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: isLib ? {
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, 'src/package/index.ts'),
        name: 'Vue3FilesPreview',
        fileName: (format) => `vue3-files-preview.${format === 'es' ? 'js' : 'umd.cjs'}`
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    } : {
      outDir: 'dist-demo'
    },
    server: {
      port: 3000,
      open: true
    }
  }
})
