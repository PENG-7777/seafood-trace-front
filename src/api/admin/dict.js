import request from '@/utils/request'

// 获取全部省份
export function getProvinceApi() {
  return request({ url: '/admin/dict/province', method: 'get' })
}

// 根据省份id获取城市
export function getCityApi(provId) {
  return request({ url: `/admin/dict/city/${provId}`, method: 'get' })
}

// 获取企业类型字典
export function getNodeTypeApi() {
  return request({ url: '/admin/dict/nodeType', method: 'get' })
}
