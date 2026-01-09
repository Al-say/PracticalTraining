<template>
     <!-- 主容器，使用 Element Plus 的 el-container 布局 -->
     <el-container class="container">
      <!-- 侧边栏，宽度 auto，包含菜单 -->
      <el-aside width="auto" class="aside">
        <Menu></Menu>
      </el-aside>
      <!-- 主内容区域 -->
      <el-container>
        <!-- 头部区域 -->
        <el-header class="header">
          <div class="header-left">
            <Collapse></Collapse>
          </div>
          <LoginOut></LoginOut>
        </el-header>
        <!-- 主内容区，显示路由视图 -->
        <el-main class="main">
            <router-view></router-view> 
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup lang="ts">
// 导入菜单组件
import Menu from './Menu.vue'; 
// 导入折叠按钮组件
import Collapse from './Collapse.vue';
// 导入退出登录组件
import LoginOut from './LoginOut.vue' 
</script>

<style lang="scss" scoped>
    .container {
        // 容器高度为视口高度，确保全屏布局
        height: 100vh;

        .aside {
            // 侧边栏背景色
            background-color: #3CA2E0;
        }

        .header {
            // 头部背景色
            background-color: #2174c2;
            display: flex;
            align-items: center;
            color: #FFF;
            justify-content: space-between;

            .header-left {
                display: flex;
                align-items: center;
            }
        }

        .main {
            // 主内容区背景色
            background-color: #fdfeff;
        }
    }

    /* 去掉 el-main 默认 padding */
    .el-main {
        padding: 0 !important;
    }

    /* 响应式设计，小屏幕时侧边栏变窄 */
    @media (max-width: 768px) {
        .aside {
            width: 150px !important;
        }
    }
</style>
