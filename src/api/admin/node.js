/**
 * @file src/api/node.js
 * @desc 流通节点企业管理模块接口请求封装
 * 后端接口统一前缀：/api/node
 * baseURL已配置为 http://127.0.0.1:8081/api，请求url省略/api前缀
 */
import request from '@/utils/request'

/**
 * 分页查询企业列表
 * @param {Object} params 请求参数
 * @param {number} params.pageNum - 当前页码
 * @param {number} params.pageSize - 每页数据条数
 * @param {string} [params.name] - 企业名称模糊检索，非必传
 * @param {number} [params.type] - 企业类型筛选(1捕捞/2养殖/3批发/4零售)，非必传
 * @returns {Promise} 返回分页NodeVO对象
 */
export function getNodePage(params) {
  return request({
    url: '/admin/node/page',
    method: 'get',
    params
  })
}

/**
 * 新增/编辑保存企业信息（后端合并接口，自动判断新增或修改）
 * @param {Object} data NodeSaveDTO表单对象
 * @param {number} [data.id] - 编辑时传入主键id；新增时不携带id
 * @returns {Promise<void>}
 */
export function saveNode(data) {
  return request({
    url: '/admin/node/save',
    method: 'post',
    data
  })
}

/**
 * 根据企业主键ID查询单条详情
 * @param {number} nodeId 企业主键id
 * @returns {Promise} 返回NodeVO详情实体
 */
export function getNodeDetail(nodeId) {
  return request({
    url: `/admin/node/detail/${nodeId}`,
    method: 'get'
  })
}

/**
 * 根据ID删除企业数据
 * @param {number} nodeId 企业主键id
 * @returns {Promise<void>}
 */
export function deleteNode(nodeId) {
  return request({
    url: `/admin/node/delete/${nodeId}`,
    method: 'delete'
  })
}
