<template>
  <div class="text-viewer-container">
    <div v-if="loading" class="text-loading">
      <div class="spinner"></div>
      <span>读取文本中...</span>
    </div>

    <div v-if="error" class="text-error">
      <span>加载失败: {{ error }}</span>
    </div>

    <pre v-show="!loading && !error" class="code-block"><code ref="codeRef" :class="languageClass">{{ formattedContent }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import hljs from 'highlight.js'
import { loadFileAsText } from '../../utils/fileLoader'

const props = defineProps<{
  src: string | File | Blob | ArrayBuffer
  type?: string
}>()

const emit = defineEmits(['load', 'error'])

const loading = ref(true)
const error = ref<string | null>(null)
const rawContent = ref('')
const codeRef = ref<HTMLElement | null>(null)

const formattedContent = computed(() => {
  if (props.type === 'json') {
    try {
      const obj = JSON.parse(rawContent.value)
      return JSON.stringify(obj, null, 2)
    } catch {
      return rawContent.value
    }
  }
  return rawContent.value
})

const languageClass = computed(() => {
  if (props.type === 'json') return 'language-json'
  if (props.type === 'code') return 'language-javascript'
  return 'language-plaintext'
})

const loadText = async () => {
  loading.value = true
  error.value = null

  try {
    rawContent.value = await loadFileAsText(props.src)
    loading.value = false
    await nextTick()

    if (codeRef.value) {
      hljs.highlightElement(codeRef.value)
    }

    emit('load')
  } catch (err: any) {
    loading.value = false
    error.value = err.message || '读取文本失败'
    emit('error', err)
  }
}

onMounted(() => {
  loadText()
})

watch(() => props.src, () => {
  loadText()
})
</script>

<style scoped>
.text-viewer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #0f172a;
  padding: 24px;
  box-sizing: border-box;
}

.text-loading, .text-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: #94a3b8;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(148, 163, 184, 0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.code-block {
  margin: 0;
  font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
}
</style>
