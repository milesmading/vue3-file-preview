<template>
  <div class="demo-container">
    <!-- Header -->
    <header class="header">
      <div class="brand">
        <div class="logo">🚀</div>
        <div>
          <h1>Vue File Preview</h1>
          <p class="subtitle">纯前端 · 全格式 · 零后端依赖的 Vue 3 文件预览插件</p>
        </div>
      </div>
      
      <div class="header-actions">
        <label class="upload-btn">
          <span>📁 上传本地文件测试</span>
          <input type="file" @change="handleFileUpload" style="display: none" />
        </label>
        <a href="https://github.com" target="_blank" class="github-link">GitHub 开源</a>
      </div>
    </header>

    <!-- Content Area -->
    <main class="main-content">
      <!-- Sidebar / Preset Selector -->
      <aside class="sidebar">
        <h3>支持的预览格式</h3>
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
              <span class="name">{{ item.name }}</span>
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
          @load="onLoad"
          @error="onError"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFilePreview } from './package'
import type { SupportedFileType } from './package/utils/fileType'

interface PresetItem {
  name: string
  icon: string
  type: SupportedFileType
  src: string | File | ArrayBuffer
}

const presets = ref<PresetItem[]>([
  {
    name: '示例 Markdown 笔记.md',
    icon: '📑',
    type: 'md',
    src: `# Vue File Preview 开源插件库\n\n欢迎使用 **Vue File Preview**！这是一个完全基于**纯前端技术**开发的高性能 Vue 3 文件预览组件库。\n\n### 特性亮点\n- ⚡ **零后端支持**: 所有的 Word、Excel、PDF、Markdown 解析均在浏览器端完成！\n- 🎨 **按需加载**: 不会造成打包体积膨胀。\n- 📱 **极致 UI 设计**: 优雅的工具栏、全屏缩放支持。\n\n\`\`\`typescript\nimport { VueFilePreview } from 'vue-file-preview'\n\`\`\``
  },
  {
    name: '代码文件 sample.json',
    icon: '💻',
    type: 'json',
    src: `{\n  "projectName": "vue-file-preview",\n  "version": "1.0.0",\n  "author": "OpenSource Developer",\n  "features": ["DOCX", "PDF", "XLSX", "Markdown", "Code", "Image", "Media"],\n  "license": "MIT"\n}`
  },
  {
    name: '示例 SVG 矢量图.svg',
    icon: '🖼️',
    type: 'image',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e1b4b"/><circle cx="200" cy="125" r="80" fill="%236366f1" opacity="0.8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold">Vue File Preview SVG</text></svg>`
  }
])

const currentPreset = ref<PresetItem>(presets.value[0])
const currentSrc = ref<string | File | ArrayBuffer>(currentPreset.value.src)
const currentFileName = ref<string>(currentPreset.value.name)
const currentFileType = ref<SupportedFileType | undefined>(currentPreset.value.type)

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
    currentFileType.value = undefined // 自动侦测
  }
}

const onLoad = () => {
  console.log('文件预览成功完成！')
}

const onError = (err: any) => {
  console.error('文件预览出错:', err)
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #030712;
  color: #f9fafb;
  overflow: hidden;
}

.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.header {
  height: 64px;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
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
  gap: 16px;
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

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.github-link {
  color: #d1d5db;
  text-decoration: none;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.github-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 64px);
}

.sidebar {
  width: 280px;
  background-color: #0b0f19;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.preset-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(2px);
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
  color: #e5e7eb;
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
  background-color: #030712;
  overflow: hidden;
}
</style>
