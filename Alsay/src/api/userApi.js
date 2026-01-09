import http from '@/http/index.js';

//查询系统用户信息
export const getUserList = (data) => {
    return http.get('/user/findUserPage', { params: data })
}
//查询系统用户信息
export const findAllUser = (data) => {
    return http.get('/user/findAllUserPage', { params: data })
}
//添加用户
export const addUser = (data) => {
    return http.post('/user/addUser', data)
}

//更新护理项目
export const updateUser = (data) => {
    return http.post('/user/updateUser', data)
}

//删除护理项目
export const delUser = (id) => {
    return http.delete(`/user/delUser/${id}`)
}
//获取验证码
export const getImageApi = () => {
    return http.post("/user/image")
}
//登录
export const loginApi = (data)=>{
    return http.post("/user/login",data)
}
//修改密码
export const updatePasswordApi = (data)=>{
    return http.put("/user/updatePassword",data)
}
