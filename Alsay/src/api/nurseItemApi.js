import http from '@/http/index.js';
//添加护理项目src/api/nurseItem.js
export const addNurseItem = (data) => {
    return http.post('/nursecontent/addNurseItem', data)
}
//更新护理项目
export const updateNurseItem = (data) => {
    return http.post('/nursecontent/updateNurseItem', data)
}
//删除护理项目
export const delNurseItem = (id) => {
    return http.delete(`/nursecontent/delNurseItem/${id}`)
}
//查询护理项目(分页)
export const findNurseItem = (data) => {
    return http.get('/nursecontent/findNurseItemPage', { params: data })
}
