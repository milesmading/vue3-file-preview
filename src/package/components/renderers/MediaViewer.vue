<template>
  <div class="media-viewer-container">
    <div v-if="isAudio" class="audio-wrapper">
      <div class="audio-card">
        <div class="audio-icon">🎵</div>
        <audio controls :src="mediaUrl" class="audio-player" @loadeddata="onLoad" @error="onError"></audio>
      </div>
    </div>

    <div v-else class="video-wrapper">
      <video controls :src="mediaUrl" class="video-player" @loadeddata="onLoad" @error="onError"></video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { loadFileAsUrl } from '../../utils/fileLoader'

const props = defineProps<{
  src: string | File | Blob | ArrayBuffer
  isAudio?: boolean
}>()

const emit = defineEmits(['load', 'error'])

const mediaUrl = ref('')

const prepareMedia = () => {
  mediaUrl.value = loadFileAsUrl(props.src)
}

const onLoad = () => emit('load')
const onError = (e: any) => emit('error', e)

onMounted(() => {
  prepareMedia()
})

watch(() => props.src, () => {
  prepareMedia()
})
</script>

<style scoped>
.media-viewer-container {
  width: 100%;
  height: 100%;
  background-color: #090d16;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.video-wrapper {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
}

.video-player {
  width: 100%;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  background-color: #000;
}

.audio-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 48px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

.audio-icon {
  font-size: 48px;
}

.audio-player {
  width: 300px;
}
</style>
