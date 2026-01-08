import http from '@/http/index.js';

//添加护理记录
export const addNurseRecord = (data) => {
    return http.post('/nurserecord/addNurseRecord', data)
}
//客户护理记录信息动态查询
export const listNurseRecordsVo = (data) => {
    return http.get('/nurserecord/listNurseRecordsVo', { params: data })
}
//移除护理记录
export const removeCustomerRecord = (id) => {
    return http.delete(`/nurserecord/removeCustomerRecord/${id}`)
}
//查询外出记录
export const queryOutwardVo = (data) => {
    return http.post('/nurserecord/queryOutwardVo', data )
}
