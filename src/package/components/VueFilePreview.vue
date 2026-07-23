<template>
  <div
    class="vue-file-preview-wrapper"
    ref="wrapperRef"
    :class="[`theme-${theme}`, { 'is-fullscreen': isFullscreen }]"
  >
    <!-- 控制工具栏槽位 -->
    <slot name="toolbar" :fileName="resolvedFileName" :fileType="detectedType" :scale="scale">
      <Toolbar
        v-if="showToolbar"
        :fileName="resolvedFileName"
        :fileType="detectedType"
        :scale="scale"
        :showZoom="canZoom"
        :showRotate="canRotate"
        :theme="theme"
        :locale="locale"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @rotate="rotateImage"
        @toggle-fullscreen="toggleFullscreen"
      >
        <template #toolbar-left>
          <slot name="toolbar-left"></slot>
        </template>
        <template #toolbar-right>
          <slot name="toolbar-right"></slot>
        </template>
      </Toolbar>
    </slot>

    <!-- 内容预览主区域 -->
    <div class="preview-content-area">
      <!-- 优先判断：如果用户注册了自定义第三方 Renderer -->
      <component
        v-if="registeredComponent"
        :is="registeredComponent"
        :src="src"
        :fileName="resolvedFileName"
        :options="options"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <!-- 内置核心 Renderer -->
      <DocxViewer
        v-else-if="detectedType === 'docx'"
        :src="src"
        :options="options?.docx"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <PdfViewer
        v-else-if="detectedType === 'pdf'"
        :src="src"
        :scale="scale"
        :options="options?.pdf"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <XlsxViewer
        v-else-if="detectedType === 'xlsx' || detectedType === 'csv'"
        :src="src"
        :options="options?.xlsx"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <MarkdownViewer
        v-else-if="detectedType === 'md'"
        :src="src"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <TextViewer
        v-else-if="detectedType === 'txt' || detectedType === 'code' || detectedType === 'json'"
        :src="src"
        :type="detectedType"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <ImageViewer
        v-else-if="detectedType === 'image'"
        :src="src"
        :scale="scale"
        :rotate="rotate"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <MediaViewer
        v-else-if="detectedType === 'video' || detectedType === 'audio'"
        :src="src"
        :isAudio="detectedType === 'audio'"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <PptxViewer
        v-else-if="detectedType === 'pptx'"
        :src="src"
        :fileName="resolvedFileName"
        :locale="locale"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <slot name="unsupported" v-else :fileName="resolvedFileName">
        <Unsupported :fileName="resolvedFileName" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { detectFileType, SupportedFileType } from '../utils/fileType'
import { getRegisteredRenderer } from '../utils/registry'
import { LocaleType } from '../utils/i18n'
import Toolbar from './Toolbar.vue'

import DocxViewer from './renderers/DocxViewer.vue'
import PdfViewer from './renderers/PdfViewer.vue'
import XlsxViewer from './renderers/XlsxViewer.vue'
import MarkdownViewer from './renderers/MarkdownViewer.vue'
import TextViewer from './renderers/TextViewer.vue'
import ImageViewer from './renderers/ImageViewer.vue'
import MediaViewer from './renderers/MediaViewer.vue'
import PptxViewer from './renderers/PptxViewer.vue'
import Unsupported from './renderers/Unsupported.vue'

const props = withDefaults(defineProps<{
  src: string | File | Blob | ArrayBuffer
  fileName?: string
  fileType?: SupportedFileType | string
  showToolbar?: boolean
  theme?: 'dark' | 'light' | 'auto'
  locale?: LocaleType
  options?: Record<string, any>
}>(), {
  showToolbar: true,
  theme: 'dark',
  locale: 'zh-CN'
})

const emit = defineEmits(['load', 'error'])

const wrapperRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const scale = ref(1.0)
const rotate = ref(0)

const resolvedFileName = computed(() => {
  if (props.fileName) return props.fileName
  if (typeof props.src === 'string') {
    const parts = props.src.split('/')
    return parts[parts.length - 1] || 'document'
  }
  if (props.src instanceof File) {
    return props.src.name
  }
  return 'file'
})

const detectedType = computed<string>(() => {
  if (props.fileType) return props.fileType
  return detectFileType(resolvedFileName.value)
})

const registeredComponent = computed(() => {
  return getRegisteredRenderer(detectedType.value)
})

const canZoom = computed(() => {
  return ['pdf', 'image'].includes(detectedType.value)
})

const canRotate = computed(() => {
  return detectedType.value === 'image'
})

const zoomIn = () => {
  if (scale.value < 3.0) scale.value += 0.25
}

const zoomOut = () => {
  if (scale.value > 0.5) scale.value -= 0.25
}

const rotateImage = () => {
  rotate.value = (rotate.value + 90) % 360
}

const toggleFullscreen = () => {
  if (!wrapperRef.value) return
  if (!document.fullscreenElement) {
    wrapperRef.value.requestFullscreen().catch(() => {})
    isFullscreen.value = true
  } else {
    document.exitFullscreen().catch(() => {})
    isFullscreen.value = false
  }
}

watch(() => props.src, () => {
  scale.value = 1.0
  rotate.value = 0
})
</script>

<style scoped>
.vue-file-preview-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
}

.vue-file-preview-wrapper.theme-dark {
  background-color: #0f172a;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

.vue-file-preview-wrapper.theme-light {
  background-color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.vue-file-preview-wrapper.is-fullscreen {
  border-radius: 0;
}

.preview-content-area {
  flex: 1;
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
  overflow: hidden;
}
</style>
