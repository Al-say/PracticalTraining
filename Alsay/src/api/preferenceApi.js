// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';
//添加护理项目
export const addPreference = (data) => {
    return http.post('/customerpreference/addCustomerperference', data)
}
//更新护理项目
export const updatePreference = (data) => {
    return http.post('/customerpreference/updateCustomerpreference', data)
}
//删除护理项目
export const delPreference = (id) => {
    return http.delete(`/customerpreference/removeCustomerpreference/${id}`)
}
//查询护理项目(分页)
export const findPreference = (data) => {
    return http.get('/customerpreference/listCustomerpreferencePage', { params: data })
}
//获取客户列表（下拉框）
export const getCustomerList = () => {
    return http.get('/customer/customerList')
}
