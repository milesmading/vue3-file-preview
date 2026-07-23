<template>
  <div class="pptx-viewer-container" tabindex="0" @keydown="onKeyDown" ref="containerRef">
    <div v-if="loading" class="pptx-loading">
      <div class="spinner"></div>
      <span>{{ t('loadingPptx', locale) }}</span>
    </div>

    <div v-if="error" class="pptx-error">
      <span>PPTX Error: {{ error }}</span>
    </div>

    <div v-show="!loading && !error" class="pptx-main">
      <div class="slide-stage" @click="handleSlideClick">
        <div class="slide-card" v-if="slides.length > 0">
          <div class="slide-header">
            <span class="slide-badge">{{ t('slide', locale) }} {{ currentIndex + 1 }} / {{ slides.length }}</span>
            <span class="key-hint">💡 ➔ / Space / Click</span>
          </div>

          <div class="slide-content">
            <div
              v-for="(block, idx) in currentSlide.blocks"
              :key="idx"
              :class="['text-block', block.isTitle ? 'title-block' : 'body-block']"
            >
              {{ block.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="pptx-controls" v-if="slides.length > 1">
        <button class="nav-btn" :disabled="currentIndex === 0" @click.stop="prevSlide">◀ {{ t('prevPage', locale) }}</button>
        <div class="slide-thumbnails">
          <button
            v-for="(_, idx) in slides"
            :key="idx"
            class="thumb-btn"
            :class="{ active: currentIndex === idx }"
            @click.stop="currentIndex = idx"
          >
            {{ idx + 1 }}
          </button>
        </div>
        <button class="nav-btn" :disabled="currentIndex === slides.length - 1" @click.stop="nextSlide">{{ t('nextPage', locale) }} ▶</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import JSZip from 'jszip'
import { loadFileAsArrayBuffer } from '../../utils/fileLoader'
import { t, LocaleType } from '../../utils/i18n'

interface SlideBlock {
  text: string
  isTitle: boolean
}

interface SlideData {
  blocks: SlideBlock[]
}

const props = withDefaults(defineProps<{
  src: string | File | Blob | ArrayBuffer
  fileName?: string
  locale?: LocaleType
}>(), {
  locale: 'zh-CN'
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const slides = ref<SlideData[]>([])
const currentIndex = ref(0)

const currentSlide = computed<SlideData>(() => {
  return slides.value[currentIndex.value] || { blocks: [] }
})

const prevSlide = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const nextSlide = () => {
  if (currentIndex.value < slides.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const handleSlideClick = () => {
  nextSlide()
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault()
    prevSlide()
  }
}

const parsePPTX = async () => {
  loading.value = true
  error.value = null
  slides.value = []
  currentIndex.value = 0

  try {
    const arrayBuffer = await loadFileAsArrayBuffer(props.src)
    const zip = await JSZip.loadAsync(arrayBuffer)

    const slideFiles = Object.keys(zip.files).filter(filename => 
      filename.startsWith('ppt/slides/slide') && filename.endsWith('.xml')
    )

    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0')
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0')
      return numA - numB
    })

    if (slideFiles.length === 0) {
      throw new Error('PPTX 文件中未检测到有效的幻灯片数据')
    }

    const parser = new DOMParser()

    for (const slidePath of slideFiles) {
      const xmlText = await zip.files[slidePath].async('string')
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

      const blocks: SlideBlock[] = []
      const paragraphs = xmlDoc.getElementsByTagName('a:p')

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i]
        const textRuns = p.getElementsByTagName('a:t')
        let pText = ''
        for (let j = 0; j < textRuns.length; j++) {
          pText += textRuns[j].textContent || ''
        }

        if (pText.trim()) {
          const isTitle = i === 0 || pText.length < 30
          blocks.push({ text: pText.trim(), isTitle })
        }
      }

      slides.value.push({ blocks })
    }

    loading.value = false
    emit('load', { slidesCount: slides.value.length })
  } catch (err: any) {
    loading.value = false
    error.value = err.message || '解析 PPTX 失败'
    emit('error', err)
  }
}

onMounted(() => {
  parsePPTX()
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

watch(() => props.src, () => {
  parsePPTX()
})
</script>

<style scoped>
.pptx-viewer-container {
  width: 100%;
  height: 100%;
  background-color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  outline: none;
}

.pptx-loading, .pptx-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(244, 63, 94, 0.2);
  border-top-color: #f43f5e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pptx-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.slide-stage {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  cursor: pointer;
}

.slide-card {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  padding: 32px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease;
}

.slide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.key-hint {
  font-size: 11px;
  color: #64748b;
}

.slide-badge {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(244, 63, 94, 0.3);
}

.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.title-block {
  font-size: 24px;
  font-weight: 800;
  color: #f8fafc;
  background: linear-gradient(135deg, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

.body-block {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.6;
}

.pptx-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 12px;
}

.nav-btn {
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-thumbnails {
  display: flex;
  gap: 6px;
}

.thumb-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.thumb-btn.active {
  background: #f43f5e;
  color: #ffffff;
  border-color: #f43f5e;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.5);
}
</style>
