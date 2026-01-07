// 引入封装好的axios  @等价于/src
import http from '@/http/index.js';

export const listRoom = () => {
     return http.get('/api/room/listRoom')
}
