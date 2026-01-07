// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';

//查询外出记录
export const queryOutwardVo = (data) => {
     return http.post('/api/outward/queryOutwardVo',data)
}

//添加外出审批
export const addOutward = (data) => {
     return http.post('/api/outward/addOutward',data)
}

//审批外出申请
export const examineOutward = (data) => {
     return http.post('/api/outward/examineOutward',data)
}

//撤回外出申请
export const delOutward = (id) => {
    return http.delete(`/api/outward/delOutward/${id}`)
}

//登记回院时间
export const updateBackTime = (data) => {
    return http.post('/api/outward/updateBackTime',data)
}
