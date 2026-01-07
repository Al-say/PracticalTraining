// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';
//添加护理项目
export const addPreference = (data) => {
    return http.post('/api/customerpreference/addCustomerperference', data)
}
//更新护理项目
export const updatePreference = (data) => {
    return http.post('/api/customerpreference/updateCustomerpreference', data)
}
//删除护理项目
export const delPreference = (id) => {
    return http.delete(`/api/customerpreference/removeCustomerpreference/${id}`)
}
//查询护理项目(分页)
export const findPreference = (data) => {
    return http.get('/api/customerpreference/listCustomerpreferencePage', { params: data })
}
