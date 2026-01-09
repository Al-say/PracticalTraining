<template>
    <div class="login">
        <el-form :inline="false" :model="loginModel" class="loginForm" ref="form" :rules="rules" size="large">
            <el-form-item>
                <div class="loginTile">系统登录</div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="loginModel.username" placeholder="请输入账户名称" clearable />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginModel.password" placeholder="请输入用户密码" type="password" show-password clearable />
            </el-form-item>
            <el-form-item prop="code">
                <el-row :gutter="10">
                    <el-col :span="16" :offset="0">
                        <el-input v-model="loginModel.code" placeholder="请输入验证码" />
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <img class="images" :src="imageSrc" @click="getImage" />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row :gutter="20" class="formBtn">
                    <el-col :span="12" :offset="0">
                        <el-button type="primary" class="myBtn" @click="commit">登 录</el-button>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-button type="danger" class="myBtn" @click="resetBtn">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getImageApi, loginApi } from '@/api/userApi.js';
import { useRouter } from 'vue-router';
import { setSessionStorage } from '@/utils/common.js';
//路由对象
const router = useRouter()
//表单对象
const form = ref(null)
//对话框对象
const loginModel = reactive({
    username: '',
    password: '',
    code: ''
})
//图片验证码
const imageSrc = ref('')
//获取验证码
const getImage = async () => {
    let res = await getImageApi()
    console.log(res)
    if (res.flag) {
        imageSrc.value = res.data
    }
}
//登录
const commit = () => {
    form.value.validate(async (valid) => {
        if (valid) {
            console.log("验证通过")
            let res = await loginApi(loginModel)
            // console.log(res)
            if (res.flag) {
                // 将当前登录用户信息存入storage中
                setSessionStorage('user', res.data);
                // 路由到第一个子菜单
                router.push({path:'/main'});
            } else {
                ElMessage.error(res.message);
            }
        } else {
            console.log("不通过")
        }
    })
}
//表单验证
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: '请输入用户密码', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入用户验证码', trigger: ['blur', 'change'] }
    ]
})
//重置
const resetBtn = () =>{
    form.value.resetFields()
}
onMounted(() => {
    getImage()
})
</script>

<style lang="scss" scoped>
.login {
    height: 100%;
    // background-color: #fff;
    background-image: url("@/assets/downloaded-image.png");
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    .loginForm {
        height: 320px;
        width: 450px;
        background-color: rgb(83 34 44 / 17%);
        border-radius: 10px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
        padding: 20px 35px;

        .loginTile {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            width: 100%;
            font-size: 32px;
            font-weight: 600;
            letter-spacing: 6px;
        }

        .images {
            height: 41px;
            width: 100%;
            cursor: pointer;
        }

        .formBtn {
            width: 100%;

            .myBtn {
                width: 222px;
            }
        }
    }
}
</style>
