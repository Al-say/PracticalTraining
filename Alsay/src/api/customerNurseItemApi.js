import http from '@/http/index.js';
//为顾客单个/批量添加护理项目
export const addItemToCustomer = (data) => {
    return http.post('/customernurseitem/addItemToCustomer', data)
}   
//移除客户护理级别级联移除用户当前级别的护理项目
export const removeCustomerLevelAndItem = (data) => {
    return http.delete(`/customernurseitem/removeCustomerLevelAndItem/${data.levelId}/${data.customerId}`)
}
//查询某个顾客的护理项目列表-分页
export const listCustomerItem = (data) => {
    return http.get('/customernurseitem/listCustomerItem', { params: data })
}
//客户续费
export const newNurseItem = (data) => {
    return http.post('/customernurseitem/enewNurseItem', data)
}
//判断用户是否已经配置了某个指定项目
export const isIncludesItemCustomer = (data) => {
    return http.get('/customernurseitem/isIncludesItemCustomer', { params: data })
}
//移除客户护理项目
export const removeCustomerItem = (id) => {
    return http.delete(`/customernurseitem/removeCustomerItem/${id}`)
}
