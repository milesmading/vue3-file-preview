<p align="center">
  <h1 align="center">🚀 vue3-file-previewer</h1>
  <p align="center">
    <strong>纯前端 · 全格式支持 · 零后端依赖的 Vue 3 文件预览插件库</strong>
  </p>
  <p align="center">
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.x-4fc08d.svg" alt="Vue 3"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg" alt="TypeScript"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646cff.svg" alt="Vite"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
  </p>
</p>

---

## ✨ 特性亮点

- ⚡ **零后端依赖**：所有的 Word、Excel、PDF、PPTX、Markdown 等解析与图形绘制均在浏览器客户端本地完成，隐私安全度极高。
- 📊 **全面覆盖主流格式**：支持 Word (`.docx`/`.doc`)、Excel (`.xlsx`/`.xls`/`.csv`)、PPT (`.pptx`/`.ppt`)、PDF (`.pdf`) 等办公文件。
- 📦 **按需异步加载**：底层解析引擎支持 Code-Splitting 动态分包，不会导致宿主应用打包体积膨胀。
- 🎨 **现代化 UI 工具栏**：提供内置高颜值玻璃化控制条，支持全屏、缩放、旋转、翻页与 Excel 多 Sheet 标签切换。
- 💻 **TypeScript 原生支持**：使用 TS 全面重构，提供完整的组件类型推导与 Prop 提示。

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

---

## 📦 安装指南

使用 npm / pnpm / yarn 安装包：

```bash
npm install vue3-file-previewer
# 或
pnpm add vue3-file-previewer
# 或
yarn add vue3-file-previewer
```

---

## 🚀 快速使用

### 1. 组件局部引入 (推荐)

```vue
<template>
  <div class="preview-container">
    <VueFilePreview 
      :src="fileUrlOrBlob" 
      :fileName="docName" 
      @load="onLoad" 
      @error="onError" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFilePreview } from 'vue3-file-previewer'
import 'vue3-file-previewer/dist/vue3-file-preview.css'

const fileUrlOrBlob = ref('https://example.com/demo.docx')
const docName = ref('示例文档.docx')

const onLoad = () => console.log('文件渲染完成！')
const onError = (err) => console.error('加载失败:', err)
</script>

<style scoped>
.preview-container {
  width: 100%;
  height: 650px;
}
</style>
```

### 2. 全局 Plugin 挂载

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import VueFilePreview from 'vue3-file-previewer'
import 'vue3-file-previewer/dist/vue3-file-preview.css'

const app = createApp(App)
app.use(VueFilePreview)
app.mount('#app')
```

---

## ⚙️ Component API 参数说明

### Props 属性列表

| 属性名 (Prop) | 类型 (Type) | 默认值 (Default) | 说明 |
| :--- | :--- | :--- | :--- |
| `src` **(必传)** | `string \| File \| Blob \| ArrayBuffer` | — | 文件输入源，支持网络 URL、File 对象、Blob 或二进制数组 |
| `fileName` | `string` | — | 文件名（用于智能识别类型与工具栏标题显示） |
| `fileType` | `string` | — | 手动指定文件类型（不传则通过后缀名自动侦测） |
| `showToolbar` | `boolean` | `true` | 是否显示顶部控制工具栏 |

### Events 事件列表

| 事件名 (Event) | 回调参数 | 说明 |
| :--- | :--- | :--- |
| `@load` | `(data?: any) => void` | 当文件解码并成功渲染时触发 |
| `@error` | `(error: any) => void` | 当文件下载、解码或渲染发生错误时触发 |

---

## 🛠️ 本地开发与测试

```bash
# 克隆仓库
git clone https://github.com/milesmading/vue3-file-preview.git

# 安装依赖
cd vue3-file-preview
npm install

# 启动本地开发服务
npm run dev

# 打包 npm 发布库文件
npm run build:lib
```

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。
