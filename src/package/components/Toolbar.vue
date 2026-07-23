<template>
  <div class="preview-toolbar" :class="[`theme-${theme}`]">
    <div class="toolbar-left">
      <slot name="toolbar-left">
        <span class="file-badge">{{ fileType.toUpperCase() }}</span>
        <span class="file-name" :title="fileName">{{ fileName || 'Document' }}</span>
      </slot>
    </div>

    <div class="toolbar-center">
      <button v-if="showZoom" class="tool-btn" @click="$emit('zoom-out')" :title="zoomOutTitle">
        <span>-</span>
      </button>
      <span v-if="showZoom" class="zoom-value">{{ Math.round(scale * 100) }}%</span>
      <button v-if="showZoom" class="tool-btn" @click="$emit('zoom-in')" :title="zoomInTitle">
        <span>+</span>
      </button>
      <button v-if="showRotate" class="tool-btn" @click="$emit('rotate')" :title="rotateTitle">
        <span>🔄</span>
      </button>
    </div>

    <div class="toolbar-right">
      <slot name="toolbar-right"></slot>
      <span class="lang-tag">{{ locale === 'en-US' ? 'EN' : 'CN' }}</span>
      <button class="tool-btn" @click="$emit('toggle-fullscreen')" :title="fullscreenTitle">
        <span>⛶</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, LocaleType } from '../utils/i18n'

const props = withDefaults(defineProps<{
  fileName?: string
  fileType: string
  scale?: number
  showZoom?: boolean
  showRotate?: boolean
  theme?: 'dark' | 'light' | 'auto'
  locale?: LocaleType
}>(), {
  scale: 1,
  showZoom: false,
  showRotate: false,
  theme: 'dark',
  locale: 'zh-CN'
})

defineEmits(['zoom-in', 'zoom-out', 'rotate', 'toggle-fullscreen'])

const zoomInTitle = computed(() => t('zoomIn', props.locale))
const zoomOutTitle = computed(() => t('zoomOut', props.locale))
const rotateTitle = computed(() => t('rotate', props.locale))
const fullscreenTitle = computed(() => t('fullscreen', props.locale))
</script>

<style scoped>
.preview-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  user-select: none;
  z-index: 100;
  transition: all 0.2s ease;
}

.preview-toolbar.theme-dark {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.preview-toolbar.theme-dark .tool-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.preview-toolbar.theme-dark .tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.preview-toolbar.theme-light {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
}

.preview-toolbar.theme-light .file-name {
  color: #1e293b;
}

.preview-toolbar.theme-light .tool-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.preview-toolbar.theme-light .tool-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 300px;
  overflow: hidden;
}

.file-badge {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-value {
  font-size: 12px;
  font-weight: 600;
  min-width: 44px;
  text-align: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.tool-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;
}
</style>
