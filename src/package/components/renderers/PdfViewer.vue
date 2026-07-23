<template>
  <div class="pdf-viewer-container" ref="containerRef">
    <div v-if="loading" class="pdf-loading">
      <div class="spinner"></div>
      <span>{{ t('loadingPdf', locale) }} ({{ t('total', locale) }} {{ totalPages }} {{ t('page', locale) }})</span>
    </div>
    
    <div v-if="error" class="pdf-error">
      <span>PDF Error: {{ error }}</span>
    </div>

    <div v-show="!loading && !error" class="pdf-pages" :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }">
      <canvas
        v-for="page in totalPages"
        :key="page"
        :ref="el => setCanvasRef(el, page)"
        class="pdf-page-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { loadFileAsArrayBuffer } from '../../utils/fileLoader'
import { t, LocaleType } from '../../utils/i18n'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const props = withDefaults(defineProps<{
  src: string | File | Blob | ArrayBuffer
  scale?: number
  locale?: LocaleType
  options?: any
}>(), {
  scale: 1.0,
  locale: 'zh-CN'
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref<HTMLElement | null>(null)
const canvasMap = new Map<number, HTMLCanvasElement>()
const loading = ref(true)
const error = ref<string | null>(null)
const totalPages = ref(0)
let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null

const setCanvasRef = (el: any, pageNum: number) => {
  if (el) {
    canvasMap.set(pageNum, el as HTMLCanvasElement)
  }
}

const renderPage = async (pageNum: number) => {
  if (!pdfDoc) return
  const page = await pdfDoc.getPage(pageNum)
  const canvas = canvasMap.get(pageNum)
  if (!canvas) return

  const viewport = page.getViewport({ scale: 1.5 })
  const context = canvas.getContext('2d')
  if (!context) return

  canvas.height = viewport.height
  canvas.width = viewport.width

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    ...props.options
  }
  await page.render(renderContext).promise
}

const loadPdf = async () => {
  loading.value = true
  error.value = null
  canvasMap.clear()

  try {
    const arrayBuffer = await loadFileAsArrayBuffer(props.src)
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    pdfDoc = await loadingTask.promise
    totalPages.value = pdfDoc.numPages

    await nextTick()

    for (let i = 1; i <= totalPages.value; i++) {
      await renderPage(i)
    }

    loading.value = false
    emit('load', { pages: totalPages.value })
  } catch (err: any) {
    loading.value = false
    error.value = err.message || '加载失败'
    emit('error', err)
  }
}

onMounted(() => {
  loadPdf()
})

watch(() => props.src, () => {
  loadPdf()
})
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.pdf-loading, .pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 14px;
  margin-top: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pdf-pages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s ease;
}

.pdf-page-canvas {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  background-color: #ffffff;
  max-width: 100%;
}
</style>
