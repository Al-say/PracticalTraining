import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0", //指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 将监听所有地址，包括局域网和公网地址。
    port: 8080, //配置端口号
    hmr: true, //开启热更新
    open: false, //启动在浏览器打开
  },
  resolve: {  //别名
    alias: [  //别名数组
      {
        find: "@",  //别名
        replacement: resolve(__dirname, "src"),  //别名对应的实际路径
      },
      {
        find: "@router",  //别名
        replacement: resolve(__dirname, "router"),  //别名对应的实际路径
      },
    ],
  },
});