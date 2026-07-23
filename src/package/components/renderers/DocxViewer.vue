<template>
  <div class="docx-viewer-container" ref="containerRef">
    <div v-if="loading" class="docx-loading">
      <div class="spinner"></div>
      <span>{{ t('loadingDocx', locale) }}</span>
    </div>
    <div v-if="error" class="docx-error">
      <span>DOCX Error: {{ error }}</span>
    </div>
    <div ref="bodyRef" class="docx-body"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { renderAsync } from 'docx-preview'
import { loadFileAsArrayBuffer } from '../../utils/fileLoader'
import { t, LocaleType } from '../../utils/i18n'

const props = withDefaults(defineProps<{
  src: string | File | Blob | ArrayBuffer
  locale?: LocaleType
  options?: any
}>(), {
  locale: 'zh-CN'
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const renderDocx = async () => {
  if (!bodyRef.value) return
  loading.value = true
  error.value = null
  bodyRef.value.innerHTML = ''

  try {
    const arrayBuffer = await loadFileAsArrayBuffer(props.src)
    await renderAsync(arrayBuffer, bodyRef.value, undefined, {
      className: 'docx-preview-wrapper',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      experimental: false,
      ...props.options
    })
    loading.value = false
    emit('load')
  } catch (err: any) {
    loading.value = false
    error.value = err.message || '未知错误'
    emit('error', err)
  }
}

onMounted(() => {
  renderDocx()
})

watch(() => props.src, () => {
  renderDocx()
})
</script>

<style scoped>
.docx-viewer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: inherit;
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.docx-loading, .docx-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #64748b;
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.docx-body {
  width: 100%;
  max-width: 900px;
}
</style>
