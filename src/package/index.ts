import type { App } from 'vue'
import VueFilePreview from './components/VueFilePreview.vue'
import Toolbar from './components/Toolbar.vue'

export { VueFilePreview, Toolbar }

export * from './utils/fileType'
export * from './utils/fileLoader'

const plugin = {
  install(app: App) {
    app.component('VueFilePreview', VueFilePreview)
  }
}

export default plugin
