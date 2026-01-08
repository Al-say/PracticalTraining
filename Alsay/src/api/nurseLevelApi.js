import http from '@/http/index.js';

//添加护理级别
export const addNurseLevel = (data) => {
    return http.post('/nurselevel/addNurseLevel', data)
}
//更新护理级别
export const updateNurseLevel = (data) => {
    return http.post('/nurselevel/updateNurseLevel', data)
}
//护理项目的配置
export const addItemToLevel = (data) => {
    return http.post('/nurselevel/addItemToLevel', data)
}
//删除护理级别
export const removeNurseLevel = (id) => {
    return http.delete(`/nurselevel/removeNurseLevel/${id}`)
}
//查询护理级别列表
export const listNurseLevel = (data) => {
    return http.get('/nurselevel/listNurseLevel', { params: data })
}
//根据护理级别查询护理项目-启用的
export const listNurseItemByLevel = (levelId) => {
    return http.get(`/nurselevel/listNurseItemByLevel?levelId=${levelId}`)
}
//删除护理级别中的护理项目 removeNurseLevelItem
export const removeNurseLevelItem = (data) => {
    return http.get('/nurselevel/removeNurseLevelItem', { params: data })
}
