<template>
     <el-container class="container">
      <el-aside width="220px" class="aside">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header class="header">Header</el-header>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup lang="ts">
import Menu from './Menu.vue'; 
</script>

<style lang="scss" scoped>
    .container {
        height: 100%;
        .aside {
            background-color: #3CA2E0;
        }
        .header {
            background-color: #81b8e8;
        }
        .main {
            background-color: #e7eaec;
        }
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .aside {
            width: 150px !important;
        }
    }
</style>
