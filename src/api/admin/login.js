import request from '@/utils/request'

// 按需导出 login 函数，供 user.js 导入
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
