import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 注册vite插件，支持vue单文件组件编译
  plugins: [vue()],

  resolve: {
    alias: {
      // 配置路径别名 @ 指向src目录，页面中可以使用@/components代替相对路径
      '@': resolve(__dirname, 'src')
    }
  },

  server: {
    // 指定前端项目启动端口 9001，访问地址 localhost:9001
    port: 5173,
    // 启动项目时自动打开浏览器
    open: true,
    proxy: {
      /**
       * 代理1：管理员后端 seafood-admin 端口8081
       * 请求前缀 /api，转发到后台8081服务，并重写路径去掉前缀
       * 前端请求示例：/api/login  →  http://localhost:8081/login
       */
      '/admin-api': {
        target: 'http://localhost:8081',
        changeOrigin: true, // 修改请求头origin，解决跨域问题
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      /**
       * 代理2：流通结点后端 seafood-node 端口8082
       * 请求前缀 /node-api，转发到后台8082服务
       * 前端请求示例：/node-api/api/node/login → http://localhost:8082/api/node/login
       */
      '/node-api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/node-api/, '')
      }
    }
  },

  build: {
    // 打包输出目录dist
    outDir: 'dist',
    // 打包构建后的静态资源文件夹名称
    assetsDir: 'static'
  }
})
