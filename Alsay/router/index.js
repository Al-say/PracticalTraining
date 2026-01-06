import { createRouter, createWebHistory } from 'vue-router'
// import Layout from '@/components/HelloWorld.vue' 
import Layout from '@/layout/Index.vue' 
// 路由配置

const routes = [
  {
    path: "/home",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/Dashboard.vue"),
        name: "dashboard",
        meta: {
          title: "系统首页",
          icon: "#icondashboard",
        },
      },
    ],
  },
  {
    path: "/bed",
    component: Layout,
    name: "bed",
    meta: {
      title: "床位管理",
      icon: "Operation",
      roles: ["sys:bed"],
    },
    children: [
      {
        path: "/bedMap",
        component: () => import("@/views/bed/BedMap.vue"),
        name: "bedMap",
        meta: {
          title: "床位示意图",
          icon: "Picture",
          roles: ["sys:bedMap"],
        },
      },
      {
        path: "/bedManage",
        component: () => import("@/views/bed/BedManage.vue"),
        name: "bedManage",
        meta: {
          title: "床位管理",
          icon: "Collection",
          roles: ["sys:bedManage"],
        },
      },
    ],
  },
  {
    path: "/customer",
    component: Layout,
    name: "customer",
    meta: {
      title: "客户管理",
      icon: "User",
      roles: ["sys:customer"],
    },
    children: [
      {
        path: "/checkIn",
        component: () => import("@/views/customer/CheckIn.vue"),
        name: "checkIn",
        meta: {
          title: "入住登记",
          icon: "DArrowRight",
          roles: ["sys:checkIn"],
        },
      },
      {
        path: "/checkOut",
        component: () => import("@/views/customer/CheckOut.vue"),
        name: "checkOut",
        meta: {
          title: "退住登记",
          icon: "DArrowLeft",
          roles: ["sys:checkOut"],
        },
      },
      {
        path: "/outRecords",
        component: () => import("@/views/customer/OutRecords.vue"),
        name: "outRecords",
        meta: {
          title: "外出登记",
          icon: "Location",
          roles: ["sys:outRecords"],
        },
      },
      {
        path: "/preference",
        component: () => import("@/views/customer/Preference.vue"),
        name: "preference",
        meta: {
          title: "膳食管理",
          icon: "Setting",
          roles: ["sys:preference"],
        },
      },
      {
        path: "/meal",
        component: () => import("@/views/customer/Meal.vue"),
        name: "meal",
        meta: {
          title: "膳食日历",
          icon: "Picture",
          roles: ["sys:meal"],
        },
      },
    ],
  },
  {
    path: "/nurse",
    component: Layout,
    name: "nurse",
    meta: {
      title: "护理管理",
      icon: "SuitcaseLine",
      roles: ["sys:nurse"],
    },
    children: [
      {
        path: "/nurseLevel",
        component: () => import("@/views/nurse/NurseLevel.vue"),
        name: "nurseLevel",
        meta: {
          title: "护理级别",
          icon: "Sort",
          roles: ["sys:nurseLevel"],
        },
      },
      {
        path: "/nurseItem",
        component: () => import("@/views/nurse/NurseItem.vue"),
        name: "nurseItem",
        meta: {
          title: "护理项目",
          icon: "ZoomIn",
          roles: ["sys:nurseItem"],
        },
      },
      {
        path: "/nurseSetting",
        component: () => import("@/views/nurse/NurseSetting.vue"),
        name: "nurseSetting",
        meta: {
          title: "客户护理设置",
          icon: "Setting",
          roles: ["sys:nurseSetting"],
        },
      },
      {
        path: "/nurseRecords",
        component: () => import("@/views/nurse/NurseRecords.vue"),
        name: "nurseRecords",
        meta: {
          title: "护理记录",
          icon: "ScaleToOriginal",
          roles: ["sys:nurseRecords"],
        },
      },
    ],
  },
  {
    path: "/health",
    component: Layout,
    name: "health",
    meta: {
      title: "健康管家",
      icon: "Coin",
      roles: ["sys:health"],
    },
    children: [
      {
        path: "/serviceCustomerSetting",
        component: () => import("@/views/health/ServiceCustomerSetting.vue"),
        name: "serviceCustomerSetting",
        meta: {
          title: "设置服务对象",
          icon: "Setting",
          roles: ["sys:serviceCustomerSetting"],
        },
      },
      {
        path: "/serviceCare",
        component: () => import("@/views/health/ServiceCare.vue"),
        name: "serviceCare",
        meta: {
          title: "服务关注",
          icon: "View",
          roles: ["sys:serviceCare"],
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    name: "user",
    meta: {
      title: "用户管理",
      icon: "Setting",
      roles: ["sys:user"],
    },
    children: [
      {
        path: "/listUser",
        component: () => import("@/views/user/ListUser.vue"),
        name: "listUser",
        meta: {
          title: "基础数据维护",
          icon: "Postcard",
          roles: ["sys:listUser"],
        },
      },
    ],
  }
];
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})
// 导出路由实例
export default router