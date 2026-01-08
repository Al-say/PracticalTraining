import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', //解决控制台 ：Network: use --host to expose
    port: 8080, //配置端口号
    hmr: true, //开启热更新
    open: true, //启动在浏览器打开
    proxy: {
      '/api': {
        target: 'http://localhost:10086/',	//接口地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 图片资源的代理配置 - 转发给后端服务器
      '/files': {
        target: 'http://localhost:10086', // 转发给后端
        changeOrigin: true,
        // 注意：这里不需要 rewrite，因为后端确实就是 /files 开头
      },
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@router': resolve(__dirname, 'src/router')
    }
  }
})