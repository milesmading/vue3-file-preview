<template>
  <div class="demo-container" :class="[`theme-${currentTheme}`]">
    <!-- Header -->
    <header class="header">
      <div class="brand">
        <div class="logo">🚀</div>
        <div>
          <h1>vue3-file-previewer</h1>
          <p class="subtitle">{{ isEn ? 'Pure Frontend · Multi-Format Vue 3 File Preview Plugin' : '高自由度 · 纯前端 · 全格式 Vue 3 文件预览插件' }}</p>
        </div>
      </div>
      
      <div class="header-actions">
        <!-- 1. 自由度：主题切换 -->
        <button class="toggle-btn" @click="toggleTheme">
          {{ currentTheme === 'dark' ? (isEn ? '☀️ Light Theme' : '☀️ 浅色主题') : (isEn ? '🌙 Dark Theme' : '🌙 深色主题') }}
        </button>

        <!-- 2. 自由度：语言切换 -->
        <button class="toggle-btn lang-btn" @click="toggleLocale">
          🌐 {{ isEn ? 'Language: English' : '语言: 中文' }}
        </button>

        <label class="upload-btn">
          <span>📁 {{ isEn ? 'Test Local File' : '测试本地文件' }}</span>
          <input type="file" @change="handleFileUpload" style="display: none" />
        </label>
      </div>
    </header>

    <!-- Content Area -->
    <main class="main-content">
      <!-- Sidebar / Preset Selector -->
      <aside class="sidebar">
        <h3>{{ isEn ? 'Supported Formats' : '支持的预览格式' }}</h3>
        <div class="preset-list">
          <button
            v-for="item in presets"
            :key="item.name"
            class="preset-card"
            :class="{ active: currentPreset.name === item.name }"
            @click="selectPreset(item)"
          >
            <span class="icon">{{ item.icon }}</span>
            <div class="info">
              <span class="name">{{ isEn ? item.nameEn : item.name }}</span>
              <span class="type-tag">{{ item.type.toUpperCase() }}</span>
            </div>
          </button>
        </div>
      </aside>

      <!-- Preview Stage -->
      <section class="stage">
        <VueFilePreview
          :src="currentSrc"
          :fileName="currentFileName"
          :fileType="currentFileType"
          :theme="currentTheme"
          :locale="currentLocale"
          @load="onLoad"
          @error="onError"
        >
          <!-- 3. 自由度：自定义插槽 Slot -->
          <template #toolbar-right>
            <button class="custom-slot-btn" @click="handleCustomDownload">
              📥 {{ isEn ? 'Download' : '下载' }}
            </button>
            <button class="custom-slot-btn" @click="handleCustomShare">
              🔗 {{ isEn ? 'Share' : '分享' }}
            </button>
          </template>
        </VueFilePreview>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueFilePreview, registerRenderer } from './package'
import type { SupportedFileType } from './package/utils/fileType'
import type { LocaleType } from './package/utils/i18n'

registerRenderer('custom-doc', {
  props: ['fileName'],
  template: `
    <div style="padding: 40px; text-align: center; color: #6366f1;">
      <h2>🧩 Custom Renderer Registered via registerRenderer!</h2>
      <p>Previewing custom format: {{ fileName }}</p>
    </div>
  `
})

interface PresetItem {
  name: string
  nameEn: string
  icon: string
  type: SupportedFileType | string
  src: string | File | ArrayBuffer
}

const currentTheme = ref<'dark' | 'light'>('dark')
const currentLocale = ref<LocaleType>('zh-CN')

const isEn = computed(() => currentLocale.value === 'en-US')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
}

const toggleLocale = () => {
  currentLocale.value = currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}

const presets = ref<PresetItem[]>([
  {
    name: '示例 Markdown 笔记.md',
    nameEn: 'Sample Markdown Note.md',
    icon: '📑',
    type: 'md',
    src: `# Vue File Previewer 插件库\n\n欢迎使用 **Vue File Previewer**！这是一个完全基于**纯前端技术**开发的高性能 Vue 3 文件预览组件库。\n\n### 特性亮点\n- ⚡ **零后端支持**: 所有的 Word、Excel、PDF、Markdown 解析均在浏览器端完成！\n- 🎨 **高自由度**: 支持 Theme 主题、i18n 多语言、Custom Slots 插槽与 Custom Renderer 插件化注册！`
  },
  {
    name: '代码文件 sample.json',
    nameEn: 'Code Sample.json',
    icon: '💻',
    type: 'json',
    src: `{\n  "projectName": "vue3-file-previewer",\n  "version": "1.1.0",\n  "author": "milesmading",\n  "features": ["DOCX", "PDF", "XLSX", "Markdown", "Slots", "Custom Renderer"],\n  "license": "MIT"\n}`
  },
  {
    name: '示例 SVG 矢量图.svg',
    nameEn: 'Sample SVG Vector.svg',
    icon: '🖼️',
    type: 'image',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e1b4b"/><circle cx="200" cy="125" r="80" fill="%236366f1" opacity="0.8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Vue File Preview SVG</text></svg>`
  }
])

const currentPreset = ref<PresetItem>(presets.value[0])
const currentSrc = ref<string | File | ArrayBuffer>(currentPreset.value.src)
const currentFileName = ref<string>(currentPreset.value.name)
const currentFileType = ref<string | undefined>(currentPreset.value.type)

const selectPreset = (item: PresetItem) => {
  currentPreset.value = item
  currentSrc.value = item.src
  currentFileName.value = item.name
  currentFileType.value = item.type
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    currentSrc.value = file
    currentFileName.value = file.name
    currentFileType.value = undefined
  }
}

const handleCustomDownload = () => {
  alert(isEn.value ? `[Slot] Downloading file: ${currentFileName.value}` : `[插槽触发] 正在下载文件: ${currentFileName.value}`)
}

const handleCustomShare = () => {
  alert(isEn.value ? '[Slot] Link copied to clipboard!' : '[插槽触发] 链接已复制到剪贴板！')
}

const onLoad = () => console.log('文件渲染完成！')
const onError = (err: any) => console.error('渲染出错:', err)
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  transition: all 0.2s ease;
}

.demo-container.theme-dark {
  background-color: #030712;
  color: #f9fafb;
}

.demo-container.theme-light {
  background-color: #f8fafc;
  color: #0f172a;
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.theme-dark .header {
  background: rgba(17, 24, 39, 0.8);
}

.theme-light .header {
  background: #ffffff;
  border-bottom-color: #e2e8f0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 28px;
}

.brand h1 {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: inherit;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-btn {
  background: rgba(99, 102, 241, 0.2) !important;
  border-color: #6366f1 !important;
  color: #a5b4fc !important;
}

.theme-light .toggle-btn {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.upload-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 64px);
}

.sidebar {
  width: 280px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.theme-dark .sidebar {
  background-color: #0b0f19;
}

.theme-light .sidebar {
  background-color: #ffffff;
  border-right-color: #e2e8f0;
}

.sidebar h3 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.theme-light .preset-card {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.preset-card.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.preset-card .icon {
  font-size: 20px;
}

.preset-card .info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.preset-card .name {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-card .type-tag {
  font-size: 10px;
  font-weight: 700;
  color: #818cf8;
}

.stage {
  flex: 1;
  padding: 24px;
  overflow: hidden;
}

.custom-slot-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>
