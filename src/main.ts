import { createApp } from 'vue'
import App from './App.vue'
import VueFilePreviewPlugin from './package'

const app = createApp(App)
app.use(VueFilePreviewPlugin)
app.mount('#app')
