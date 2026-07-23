<template>
  <div class="markdown-viewer-container">
    <div v-if="loading" class="md-loading">
      <div class="spinner"></div>
      <span>加载 Markdown 中...</span>
    </div>

    <div v-if="error" class="md-error">
      <span>加载失败: {{ error }}</span>
    </div>

    <div v-show="!loading && !error" class="markdown-body" v-html="htmlContent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { loadFileAsText } from '../../utils/fileLoader'

const props = defineProps<{
  src: string | File | Blob | ArrayBuffer
}>()

const emit = defineEmits(['load', 'error'])

const loading = ref(true)
const error = ref<string | null>(null)
const htmlContent = ref('')

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
} as any)

const loadMarkdown = async () => {
  loading.value = true
  error.value = null

  try {
    const text = await loadFileAsText(props.src)
    htmlContent.value = await marked.parse(text)
    loading.value = false
    emit('load')
  } catch (err: any) {
    loading.value = false
    error.value = err.message || 'Markdown 解析错误'
    emit('error', err)
  }
}

onMounted(() => {
  loadMarkdown()
})

watch(() => props.src, () => {
  loadMarkdown()
})
</script>

<style scoped>
.markdown-viewer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #0f172a;
  color: #f8fafc;
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.md-loading, .md-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.markdown-body {
  width: 100%;
  max-width: 860px;
  line-height: 1.7;
  font-family: system-ui, -apple-system, sans-serif;
}

:deep(h1), :deep(h2), :deep(h3) {
  color: #f1f5f9;
  border-bottom: 1px solid #334155;
  padding-bottom: 8px;
  margin-top: 24px;
}

:deep(p) {
  color: #cbd5e1;
  margin: 12px 0;
}

:deep(pre) {
  background-color: #1e293b;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #334155;
}

:deep(code) {
  font-family: 'Fira Code', monospace;
  background-color: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  color: #38bdf8;
}
</style>
