import http from '@/http/index.js';
//查询食品项目
export const findFood = () => {
     return http.get('/api/food/listFood')
}
//添加食品项目
export const addFood = (data) => {
     return http.post('/api/food/addFood',data)
}
//更新食品项目
export const updateFood = (data) => {
     return http.post('/api/food/updateFood',data)
}
//删除食品项目
export const delFood = (id) => {
    return http.delete(`/api/food/removeFood/${id}`)
}
