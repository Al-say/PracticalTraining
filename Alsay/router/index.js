import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/HelloWorld.vue' 

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout
  }
]
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})
// 导出路由实例
export default router