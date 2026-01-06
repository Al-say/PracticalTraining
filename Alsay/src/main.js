import { createApp } from 'vue' // 引入 createApp 函数
import './style.css'// 引入全局样式文件
import App from './App.vue'// 引入根组件 App.vue
import router from '@router'// 引入路由实例

const app = createApp(App) // 创建 Vue 应用实例

app.use(router) // 使用路由实例

//引入ElementPlus
import ElementPlus from "element-plus";
//引入ElementPlus样式
import "element-plus/dist/index.css";
//引入ElementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入 pinia
import { createPinia } from 'pinia'
//创建 pinia 实例
const pinia = createPinia()

// 使用 ElementPlus
app.use(ElementPlus)
// 注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 使用 pinia
app.use(pinia)

app.mount('#app')// 创建 Vue 应用实例并挂载到 id 为 app 的 DOM 元素上


