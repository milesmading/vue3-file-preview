<template>
  <div class="vue-file-preview-wrapper" ref="wrapperRef" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 控制工具栏 -->
    <Toolbar
      v-if="showToolbar"
      :fileName="resolvedFileName"
      :fileType="detectedType"
      :scale="scale"
      :showZoom="canZoom"
      :showRotate="canRotate"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @rotate="rotateImage"
      @toggle-fullscreen="toggleFullscreen"
    />

    <!-- 内容预览主区域 -->
    <div class="preview-content-area">
      <DocxViewer
        v-if="detectedType === 'docx'"
        :src="src"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <PdfViewer
        v-else-if="detectedType === 'pdf'"
        :src="src"
        :scale="scale"
        @load="$emit('load')"
        @error="e => $emit('error', e)"
      />

      <XlsxViewer
        v-else-if="detectedType === 'xlsx' || detectedType === 'csv'"
        :src="src"
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
      />

      <Unsupported
        v-else
        :fileName="resolvedFileName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { detectFileType, SupportedFileType } from '../utils/fileType'
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
  fileType?: SupportedFileType
  showToolbar?: boolean
}>(), {
  showToolbar: true
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

const detectedType = computed<SupportedFileType>(() => {
  if (props.fileType) return props.fileType
  return detectFileType(resolvedFileName.value)
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
  background-color: #0f172a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  position: relative;
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
