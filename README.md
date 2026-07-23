<p align="center">
  <h1 align="center">🚀 vue3-file-previewer</h1>
  <p align="center">
    <strong>高自由度 · 纯前端 · 全格式支持 · 零后端依赖的 Vue 3 文件预览插件库</strong>
  </p>
  <p align="center">
    <a href="https://milesmading.github.io/vue3-file-preview/"><img src="https://img.shields.io/badge/Live-Demo-brightgreen.svg" alt="Live Demo"></a>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.x-4fc08d.svg" alt="Vue 3"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg" alt="TypeScript"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646cff.svg" alt="Vite"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
  </p>
</p>

---

## 🌐 实时在线演示 (Live Demo)

👉 **直接在线点击体验**：**[https://milesmading.github.io/vue3-file-preview/](https://milesmading.github.io/vue3-file-preview/)**

无需安装任何环境，支持在网页中直接体验：
- 📄 DOCX / PDF / XLSX / PPTX / Markdown / Code / SVG 多格式渲染；
- ☀️ 深浅主题切换、🌐 中英文多语言热更新、按钮插槽扩展及自定义驱动注册。

---

## ✨ 5 大核心高自由度特性 (v1.1.0)

- 🎨 **主题深浅自如**：支持 `:theme="'dark' | 'light'"` 深色与浅色极简主题，完美契合系统 UI。
- 🛠️ **全套 Vue Slots 扩展**：开放 `#toolbar-left`、`#toolbar-right` 插槽，可自由添加下载、分享、打印等自定义按钮。
- 🧩 **插件化自定义渲染器**：暴露 `registerRenderer('dwg', CustomComponent)`，开发者可自由扩展 3D 模型 `.stl`、CAD 图纸 `.dwg` 等自定义格式驱动。
- 🌐 **国际化 (i18n)**：原生支持中英文 `:locale="'zh-CN' | 'en-US'"` 自动无缝切换。
- ⚙️ **原生参数透传**：支持通过 `:options="{ docx: {...}, pdf: {...} }"` 微调底层驱动原生参数。

---

## 📊 格式支持一览

| 文件格式 | 扩展名 | 渲染驱动 | 功能支持 |
| :--- | :--- | :--- | :--- |
| **Microsoft Word** | `.docx`, `.doc` | `docx-preview` | 支持排版、标题、列表、段落样式渲染 |
| **Microsoft Excel** | `.xlsx`, `.xls`, `.csv` | `xlsx` | 支持 `.xls` / `.xlsx` / `.csv` 多 Sheet 表格切换 |
| **Microsoft PowerPoint**| `.pptx`, `.ppt` | `JSZip` + XML | 支持 `.pptx` / `.ppt` 多页 Slide 切换、键盘左右方向键 `➔` 翻页 |
| **PDF 文档** | `.pdf` | `pdfjs-dist` | 支持多页 Canvas 逐页渲染与比例缩放 |
| **Markdown 笔记** | `.md` | `marked` | 支持 Markdown 渲染与代码块语法高亮 |
| **文本 / 代码 / JSON** | `.txt`, `.json`, `.js` | `highlight.js` | 支持 JSON 缩进排版与代码高亮 |
| **图像与音视频** | `.png`, `.jpg`, `.svg`, `.mp4`, `.mp3` | HTML5 原生 | 支持图片放大缩放、旋转、音视频播放 |
| **自定义扩展格式** | 任意后缀 | 扩展渲染器 | 通过 `registerRenderer` 自由扩展第三方格式 |

---

## 📦 安装指南

```bash
npm install vue3-file-previewer
# 或
pnpm add vue3-file-previewer
```

---

## 🚀 高自由度用法示例

### 1. 自定义主题、语言与按钮插槽 (Slots)

```vue
<template>
  <div style="height: 650px;">
    <VueFilePreview 
      :src="fileUrl" 
      fileName="文档.docx" 
      theme="light"
      locale="en-US"
    >
      <!-- 自定义扩展控制栏右侧按钮 -->
      <template #toolbar-right>
        <button @click="onDownload">📥 Download</button>
      </template>
    </VueFilePreview>
  </div>
</template>

<script setup lang="ts">
import { VueFilePreview } from 'vue3-file-previewer'
import 'vue3-file-previewer/dist/vue3-file-previewer.css'

const fileUrl = 'https://example.com/demo.docx'
const onDownload = () => alert('下载文件！')
</script>
```

### 2. 插件化注册自定义格式驱动 (Plugin Driver)

```typescript
import { registerRenderer } from 'vue3-file-previewer'
import CadViewerComponent from './CadViewerComponent.vue'

// 注册 CAD .dwg 图纸渲染驱动
registerRenderer('dwg', CadViewerComponent)
```

---

## ⚙️ Component API 参数说明

### Props 属性列表

| 属性名 (Prop) | 类型 (Type) | 默认值 (Default) | 说明 |
| :--- | :--- | :--- | :--- |
| `src` **(必传)** | `string \| File \| Blob \| ArrayBuffer` | — | 文件输入源，支持 URL、File、Blob 或二进制数组 |
| `fileName` | `string` | — | 文件名（用于智能识别类型与工具栏标题显示） |
| `fileType` | `string` | — | 手动指定文件类型（不传则通过后缀名自动侦测） |
| `theme` | `'dark' \| 'light'` | `'dark'` | 界面主题外观切换 |
| `locale` | `'zh-CN' \| 'en-US'` | `'zh-CN'` | 界面语言包 |
| `showToolbar` | `boolean` | `true` | 是否显示顶部控制工具栏 |
| `options` | `Record<string, any>` | `{}` | 透传给底层引擎（docx, pdf, xlsx）的原生配置参数 |

### Slots 插槽列表

| 插槽名 (Slot) | 说明 |
| :--- | :--- |
| `#toolbar` | 完全自定义顶部控制栏 |
| `#toolbar-left` | 自定义控制栏左侧标识或 Logo 区域 |
| `#toolbar-right` | 在控制栏右侧添加自定义按钮（如下载、分享、打印） |
| `#unsupported` | 自定义未支持格式的展示卡片 |

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。
