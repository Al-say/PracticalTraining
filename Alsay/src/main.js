import { createApp } from 'vue' // 引入 createApp 函数
import './style.css'// 引入全局样式文件
import App from './App.vue'// 引入根组件 App.vue
import router from '@router'// 引入路由实例

const app = createApp(App) // 创建 Vue 应用实例

app.use(router) // 使用路由实例

app.mount('#app')// 创建 Vue 应用实例并挂载到 id 为 app 的 DOM 元素上
