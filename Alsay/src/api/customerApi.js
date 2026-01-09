// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';

// 入住登记-入住
export const addCustomer = (data) => {
    return http.post('/customer/addCustomer', data)
}

//入住登记-客户信息列表
export const getListPage = (data) => {
    return http.get('/customer/listPage', { params: data })
}

//删除客户
export const delCustomer = (data) => {
    return http.get('/customer/delCustomer', { params: data })
}

//编辑客户
export const editCustomer = (data) => {
    return http.post('/customer/editCustomer', data)
}

//获取客户详情
export const getCustomerById = (id) => {
    return http.get('/customer/getCustomerById', { params: { id:id } })
}

//查询所有客户
export const getCustomerList = () => {
    return http.get('/customer/getCustomerList')
}
