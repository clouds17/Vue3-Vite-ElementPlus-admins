import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'virtual:windi.css'
import 'nprogress/nprogress.css'
import App from './App.vue'
import { router } from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

app.config.globalProperties.$baseImg = import.meta.env.VITE_IMAGE_URL

app.use(router)
app.use(store)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 导入路由全局守卫
import './permission.js'

// 指令权限控制
import permission from './directive/permission.js'
app.use(permission)


app.mount('#app')
