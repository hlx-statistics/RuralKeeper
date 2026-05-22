import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initSafeArea } from '@/utils/safe-area'
import './styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

void initSafeArea().finally(() => {
  app.mount('#app')
})
