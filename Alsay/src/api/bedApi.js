// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';

//获取床位示意图视图数据
export const findBedVo = (data) => {
    return http.get('/api/room/findBedVo', { params: data })
}
//根据房间查询床位信息
export const findBedByRoom = (data) => {
    return http.get('/api/bed/findBed', { params: data })
}
//查询床位详情信息-分页
export const findBedDetailsList = (data) => {
    return http.get('/api/bedDetails/listBedDetailsVoPage', { params: data })
}
//更新床位详情信息-床位开始使用时间
export const updateDetailsStartDate = (data) => {
     return http.post('/api/bedDetails/updateBedDetails', data)
}
//床位调换
export const exchangeBed = (data) => {
    return http.post('/api/bedDetails/exchangeBed', data)
}
//删除床位详情
export const delBedDetails = (id) => {
    return http.delete(`/api/bedDetails/delBedDetails/${id}`)
}
