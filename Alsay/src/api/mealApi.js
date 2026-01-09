import http from '@/http/index.js';
//添加
export const addMeal = (data) => {
    return http.post('/meal/addMeal', data)
}
//更新
export const updateMeal = (data) => {
    return http.post('/meal/updateMeal', data)
}
//删除
export const delMeal = (id) => {
    return http.delete(`/meal/removeMeal/${id}`)
}
//查询(分页)
export const findMeal = (data) => {
    return http.post('/meal/listMealPage', data)
}
