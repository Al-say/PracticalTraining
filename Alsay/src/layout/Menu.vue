<template>
    <el-menu default-active="/dashboard" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened router
        @open="handleOpen" @close="handleClose" background-color="#3CA2E0" text-color="#fff" active-text-color="#ffd04b">
        <MenuItem :menuList="menuList"></MenuItem>
    </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import MenuItem from './MenuItem.vue';
//菜单数据
let menuList = reactive([
    {
        path: "/dashboard",
        component: "Layout",
        name: "dashboard",
        meta: {
            title: "系统首页",
            icon: "HomeFilled",
            roles: ["sys:dashboard"],
        },
    },
    {
        path: "/bed",
        component: "Layout",
        name: "bed",
        meta: {
            title: "床位管理",
            icon: "Operation",
            roles: ["sys:bed"],
        },
        children: [
            {
                path: "/bedMap",
                component: "/bed/bedMap",
                name: "bedMap",
                meta: {
                    title: "床位示意图",
                    icon: "Picture",
                    roles: ["sys:bedMap"],
                },
            },
            {
                path: "/bedManage",
                component: "/bed/bedManage",
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
        component: "Layout",
        name: "customer",
        meta: {
            title: "客户管理",
            icon: "User",
            roles: ["sys:customer"],
        },
        children: [
            {
                path: "/checkIn",
                component: "/customer/checkIn",
                name: "checkIn",
                meta: {
                    title: "入住登记",
                    icon: "DArrowRight",
                    roles: ["sys:checkIn"],
                },
            },
            {
                path: "/checkOut",
                component: "/customer/checkOut",
                name: "checkOut",
                meta: {
                    title: "退住登记",
                    icon: "DArrowLeft",
                    roles: ["sys:checkOut"],
                },
            },
            {
                path: "/outRecords",
                component: "/customer/outRecords",
                name: "outRecords",
                meta: {
                    title: "外出登记",
                    icon: "Location",
                    roles: ["sys:outRecords"],
                },
            },
            {
                path: "/preference",
                component: "/customer/preference",
                name: "preference",
                meta: {
                    title: "膳食管理",
                    icon: "Setting",
                    roles: ["sys:preference"],
                },
            },
            {
                path: "/meal",
                component: "/customer/meal",
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
        component: "Layout",
        name: "nurse",
        meta: {
            title: "护理管理",
            icon: "SuitcaseLine",
            roles: ["sys:nurse"],
        },
        children: [
            {
                path: "/nurseLevel",
                component: "/nurse/nurseLevel",
                name: "nurseLevel",
                meta: {
                    title: "护理级别",
                    icon: "Sort",
                    roles: ["sys:nurseLevel"],
                },
            },
            {
                path: "/nurseItem",
                component: "/nurse/nurseItem",
                name: "nurseItem",
                meta: {
                    title: "护理项目",
                    icon: "ZoomIn",
                    roles: ["sys:nurseItem"],
                },
            },
            {
                path: "/nurseSetting",
                component: "/nurse/nurseSetting",
                name: "nurseSetting",
                meta: {
                    title: "客户护理设置",
                    icon: "Setting",
                    roles: ["sys:nurseSetting"],
                },
            },
            {
                path: "/nurseRecords",
                component: "/nurse/nurseRecords",
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
        component: "Layout",
        name: "health",
        meta: {
            title: "健康管家",
            icon: "Coin",
            roles: ["sys:health"],
        },
        children: [
            {
                path: "/serviceCustomerSetting",
                component: "/health/serviceCustomerSetting",
                name: "serviceCustomerSetting",
                meta: {
                    title: "设置服务对象",
                    icon: "Setting",
                    roles: ["sys:serviceCustomerSetting"],
                },
            },
            {
                path: "/serviceCare",
                component: "/health/serviceCare",
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
        component: "Layout",
        name: "user",
        meta: {
            title: "用户管理",
            icon: "Avatar",
            roles: ["sys:user"],
        },
        children: [
            {
                path: "/listUser",
                component: "/user/listUser",
                name: "listUser",
                meta: {
                    title: "基础数据维护",
                    icon: "List",
                    roles: ["sys:listUser"],
                },
            },
        ],
    }
]);
//折叠
const isCollapse = ref(false)
//展开
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
//关闭
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}

/* 响应式 */
@media (max-width: 768px) {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 150px;
    }
}

.el-menu {
    border-right: none;
}

:deep(.el-sub-menu .el-sub-menu__title) {
    color: #f4f4f5 !important;
}
/* 所有子菜单中文字的颜色 */
:deep(.el-menu .el-menu-item) {
    color: #f8f7f9;
}

/* 菜单点中文字的颜色 */
:deep(.el-menu-item.is-active) {
    color: #0648e3 !important;
}

/* 当前打开菜单的所有子菜单颜色 */
:deep(.is-opened .el-menu-item) {
    background-color: #3CA2E0 !important;
}

/* 鼠标移动菜单的颜色 */
:deep(.el-menu-item:hover) {
    background-color: #66b5df !important;
}
</style>
