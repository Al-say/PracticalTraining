import axios from "axios";
import router from "../router"
import { ElMessage } from 'element-plus'; // 引入Element Plus的消息组件

const instance = axios.create({
    baseURL: "", // 使用代理时设置为空
    timeout: 10000, // 设置超时时间为10秒
    withCredentials: true // 允许携带cookie
})

// 请求拦截器
instance.interceptors.request.use(
    function (config) {
        // let token = sessionStorage.getItem("token")
        let token = '' //在请求头部携带token
        if (token) {
            config.headers["token"] = token;
        }
        console.log("instance.interceptors.request.use--config ===>"+config)
        return config;
    },
    function (error) {
        ElMessage.error('请求发送失败!!!');
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 响应数据处理 
        if (!response.data.flag && response.data.data == "token_error") {
            ElMessage.error('登录已过期，请重新登录');
            router.push("/login")
        }
        return response.data;
    }, 
    //错误处理 
    function (error) {
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            ElMessage.error('请求超时，请检查网络连接');
        } else if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            switch (error.response.status) {
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    ElMessage.error(`连接错误 ${error.response.status}`);
            }
        } else {
            // 请求未发出或没有收到响应
            ElMessage.error('无法连接到服务器，请检查您的网络连接或联系管理员');
        }
        return Promise.reject(error);
    }
);

export default instance
