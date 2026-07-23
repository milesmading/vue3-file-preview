<template>
  <div class="unsupported-container">
    <div class="unsupported-card">
      <div class="icon">📁</div>
      <h3>暂不支持直接预览该格式</h3>
      <p class="file-name" v-if="fileName">{{ fileName }}</p>
      <p class="tip">您可以下载文件到本地后通过对应应用程序查看。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  fileName?: string
}>()
</script>

<style scoped>
.unsupported-container {
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.unsupported-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
}

.icon {
  font-size: 48px;
}

.file-name {
  font-family: monospace;
  background-color: #0f172a;
  padding: 4px 12px;
  border-radius: 6px;
  color: #38bdf8;
  font-size: 13px;
}

.tip {
  color: #94a3b8;
  font-size: 14px;
}
</style>
