<template>
  <div class="preview-toolbar">
    <div class="toolbar-left">
      <span class="file-badge">{{ fileType.toUpperCase() }}</span>
      <span class="file-name" :title="fileName">{{ fileName || '未知文件' }}</span>
    </div>

    <div class="toolbar-center">
      <button v-if="showZoom" class="tool-btn" @click="$emit('zoom-out')" title="缩小">
        <span>-</span>
      </button>
      <span v-if="showZoom" class="zoom-value">{{ Math.round(scale * 100) }}%</span>
      <button v-if="showZoom" class="tool-btn" @click="$emit('zoom-in')" title="放大">
        <span>+</span>
      </button>
      <button v-if="showRotate" class="tool-btn" @click="$emit('rotate')" title="旋转">
        <span>🔄</span>
      </button>
    </div>

    <div class="toolbar-right">
      <button class="tool-btn" @click="$emit('toggle-fullscreen')" title="全屏切换">
        <span>⛶</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  fileName?: string
  fileType: string
  scale?: number
  showZoom?: boolean
  showRotate?: boolean
}>()

defineEmits(['zoom-in', 'zoom-out', 'rotate', 'toggle-fullscreen'])
</script>

<style scoped>
.preview-toolbar {
  height: 48px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: #f8fafc;
  user-select: none;
  z-index: 100;
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
  color: #cbd5e1;
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
  color: #94a3b8;
  min-width: 44px;
  text-align: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
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

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateY(-1px);
}
</style>
