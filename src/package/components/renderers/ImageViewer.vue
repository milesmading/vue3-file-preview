<template>
  <div class="image-viewer-container">
    <div v-if="loading" class="img-loading">
      <div class="spinner"></div>
      <span>加载图片中...</span>
    </div>

    <div v-if="error" class="img-error">
      <span>图片加载失败</span>
    </div>

    <div v-show="!loading && !error" class="image-wrapper">
      <img
        :src="imageUrl"
        class="preview-image"
        :style="{ transform: `scale(${scale}) rotate(${rotate}deg)` }"
        @load="onImageLoad"
        @error="onImageError"
        alt="Preview Image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { loadFileAsUrl } from '../../utils/fileLoader'

const props = withDefaults(defineProps<{
  src: string | File | Blob | ArrayBuffer
  scale?: number
  rotate?: number
}>(), {
  scale: 1,
  rotate: 0
})

const emit = defineEmits(['load', 'error'])

const imageUrl = ref('')
const loading = ref(true)
const error = ref(false)

const prepareImage = () => {
  loading.value = true
  error.value = false
  imageUrl.value = loadFileAsUrl(props.src)
}

const onImageLoad = () => {
  loading.value = false
  emit('load')
}

const onImageError = (err: any) => {
  loading.value = false
  error.value = true
  emit('error', err)
}

onMounted(() => {
  prepareImage()
})

watch(() => props.src, () => {
  prepareImage()
})
</script>

<style scoped>
.image-viewer-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #090d16;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.img-loading, .img-error {
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

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  transition: transform 0.2s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
}
</style>
