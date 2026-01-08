import http from '@/http/index.js';

//上传图片
export const upload = (data) => {
    return http.post('/upload/uploadImage', data)
}
