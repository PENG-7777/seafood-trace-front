// src/utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例，baseURL置空，请求拦截器动态拼接地址
const service = axios.create({
  timeout: 10000
})

// 服务地址映射规则
const SERVER_MAP = {
  admin: 'http://127.0.0.1:8081/api',
  node: 'http://127.0.0.1:8082/api'
}

// 登录白名单
const LOGIN_WHITE_LIST = ['/admin/login', '/node/login']
const isLoginRequest = (url) => {
  if (!url) return false
  return LOGIN_WHITE_LIST.some(item => url.includes(item))
}

// 请求拦截器：动态匹配后端地址 + 登录接口不带token
service.interceptors.request.use(
  (config) => {
    // 根据url前缀选择对应端口服务
    if(config.url.startsWith('/admin')){
      config.baseURL = SERVER_MAP.admin
    }else if(config.url.startsWith('/node')){
      config.baseURL = SERVER_MAP.node
    }

    // 非登录接口自动携带对应端token
    if (!isLoginRequest(config.url)) {
      const adminInfo = JSON.parse(localStorage.getItem('user') || '{}')
      const nodeInfo = JSON.parse(localStorage.getItem('nodeUser') || '{}')
      if (config.url.startsWith('/admin') && adminInfo.token) {
        config.headers.token = adminInfo.token
      } else if (config.url.startsWith('/node') && nodeInfo.token) {
        config.headers.token = nodeInfo.token
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    const reqUrl = response.config.url
    console.log('【接口返回】', res)

    // ==========登录接口：直接返回完整对象，业务判断交给页面==========
    if (isLoginRequest(reqUrl)) {
      return res
    }

    // ==========非登录业务接口：code=401才执行登出跳转==========
    if (res.code === 401) {
      ElMessage.warning('未登录或Token已失效，请重新登录')
      if (reqUrl.startsWith('/node')) {
        localStorage.removeItem('nodeUser')
        router.push('/node/login')
      } else {
        localStorage.removeItem('user')
        router.push('/login')
      }
      return Promise.reject(new Error(res.msg || 'Token失效'))
    }

    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg))
    }
    return res
  },
  (error) => {
    const reqUrl = error.config?.url
    const httpStatus = error.response?.status
    console.log('【请求异常详情】', { url: reqUrl, status: httpStatus })

    if (isLoginRequest(reqUrl)) {
      const backendMsg = error.response?.data?.msg || '账号或密码错误'
      ElMessage.error(backendMsg)
      return Promise.reject(error)
    }

    if (httpStatus === 401) {
      ElMessage.warning('未登录或Token已失效，请重新登录')
      if (reqUrl.startsWith('/node')) {
        localStorage.removeItem('nodeUser')
        router.push('/node/login')
      } else {
        localStorage.removeItem('user')
        router.push('/login')
      }
    } else {
      ElMessage.error(error.message || '服务器异常')
    }
    return Promise.reject(error)
  }
)

export default service
