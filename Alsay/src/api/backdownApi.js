// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';

//查询退住记录
export const queryBackdownVo = (data) => {
    return http.post('/api/backdown/listBackdown', data)
}

//添加退住登记
export const addBackdown = (data) => {
    return http.post('/api/backdown/addBackdown', data)
}

//审批外出申请
export const examineBackdown = (data) => {
    return http.post('/api/backdown/examineBackdown', data)
}

//撤回外出申请
export const delBackdown = (data) => {
    return http.delete(`/api/backdown/delBackdown/${data}`)
}
