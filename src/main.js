import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'virtual:windi.css'
import 'nprogress/nprogress.css'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.config.globalProperties.$baseImg = import.meta.env.VITE_IMAGE_URL

app.use(router)
app.use(store)
app.use(ElementPlus)


import './permission.js'

app.mount('#app')
