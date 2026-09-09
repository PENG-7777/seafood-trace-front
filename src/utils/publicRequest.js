// src/utils/publicRequest.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建独立公开axios实例，溯源公开接口无需Token、不走登录校验逻辑
const publicRequest = axios.create({
  baseURL: 'http://127.0.0.1:8082/api',
  timeout: 10000
})
// 公开接口：不携带任何token，拦截器直接放行
publicRequest.interceptors.request.use(config => {
  return config
})
// 统一响应处理
publicRequest.interceptors.response.use(
  (response) => {
    const res = response.data
    // 业务码非200，只抛出错误，不在拦截器弹窗
    if (res.code !== 200) {
      return Promise.reject(new Error(res.msg || '操作失败'))
    }
    return res
  },
  (error) => {
    // http层面异常：断网、跨域、服务宕机在这里统一提示
    ElMessage.error('溯源服务访问异常，请稍后重试')
    return Promise.reject(error)
  }
)
export default publicRequest
