import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'

// 路由配置
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: '/main',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '系统首页' }
      },
      {
        path: 'bedMap',
        component: () => import('@/views/bed/BedMap.vue'),
        meta: { title: '床位示意图' }
      },
      {
        path: 'bedManage',
        component: () => import('@/views/bed/BedManage.vue'),
        meta: { title: '床位管理' }
      },
      {
        path: 'checkIn',
        component: () => import('@/views/customer/CheckIn.vue'),
        meta: { title: '入住登记' }
      },
      {
        path: 'checkOut',
        component: () => import('@/views/customer/CheckOut.vue'),
        meta: { title: '退住登记' }
      },
      {
        path: 'outRecords',
        component: () => import('@/views/customer/OutRecords.vue'),
        meta: { title: '外出登记' }
      },
      {
        path: 'preference',
        component: () => import('@/views/customer/Preference.vue'),
        meta: { title: '膳食管理' }
      },
      {
        path: 'meal',
        component: () => import('@/views/customer/Meal.vue'),
        meta: { title: '膳食日历' }
      },
      {
        path: 'nurseLevel',
        component: () => import('@/views/nurse/NurseLevel.vue'),
        meta: { title: '护理级别' }
      },
      {
        path: 'nurseItem',
        component: () => import('@/views/nurse/NurseItem.vue'),
        meta: { title: '护理项目' }
      },
      {
        path: "/addItemToLevel",
        component: () => import("@/views/nurse/AddItemToLevel.vue"),
        name: "addItemToLevel",
        meta: {
          title: "护理项目配置",
          icon: "Setting",
          roles: ["sys:addItemToLevel"],
        },
      },
      {
        path: "/userToCustomerService",
        component: () => import("@/views/health/UserToCustomerService.vue"),
        name: "userToCustomerService",
        meta: {
          title: "设置服务",
          icon: "Setting",
          roles: ["sys:userToCustomerService"],
        },
      },
      {
        path: "/serviceBuy",
        component: () => import("@/views/health/ServiceBuy.vue"),
        name: "serviceBuy",
        meta: {
          title: "购买护理服务",
          icon: "Setting",
          roles: ["sys:serviceBuy"],
        },
      },
      {
        path: "/userManage",
        component: () => import("@/views/health/UserManage.vue"),
        name: "userManage",
        meta: {
          title: "用户管理",
          icon: "Setting",
          roles: ["sys:userManage"],
        },
      }
      // 其他页面可以继续添加
    ]
  },
  // 添加 /home 重定向到 /dashboard
  {
    path: '/home',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
