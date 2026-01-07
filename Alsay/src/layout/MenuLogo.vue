<template>
    <div class="logo">
        <img v-if="show" :src="logo" class="logo-icon" />
        <span v-if="show" class="logo-title">{{ title }}</span>
    </div>
</template>
<script setup lang="ts">
// import MenuLogo from '@/assets/logo.png'
import { ref, watch } from "vue";
import { collapseStore } from '@/store/collapse/index';
import logo from '@/assets/logo.svg';
// 引入 collapseStore
const store = collapseStore()

const title = ref("马师院智慧养老");

const show = ref(true)// 显示logo
// 监听折叠状态
watch(
    ()=>store.getCollapse,
    (collapsed)=>{
        if(!collapsed){
            setTimeout(() => {
                show.value = !collapsed;//延迟执行
            }, 300);
        }else{
            show.value = !collapsed;
        }
    }
)
</script>
<style lang="scss" scoped>
.logo {
    display: flex;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #3CA2E0;
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    .logo-icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .logo-title {
        color: #fff;
        font-weight: bold;
        line-height: 60px;
        font-size: 20px;
        /* font-family: "楷体"; */
        letter-spacing: 3px;
    }
}
</style>
