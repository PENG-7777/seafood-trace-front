// 零售商批号管理接口文件
// 引入流通结点axios实例nodeRequest，请求拦截器自动携带登录Token完成鉴权
import nodeRequest from '@/utils/request'

/**
 * 获取当前登录零售商自身的批号列表
 * @returns {Promise} Result<List<RetaBatch>> 返回零售商批号数据集合
 * GET请求，后端通过Token自动解析登录企业nodeId，前端无需传递id参数
 * 接口地址：/api/node/retaBatch/list
 */
export function getRetaBatchList() {
  return nodeRequest({
    url: '/api/node/retaBatch/list',
    method: 'GET'
  })
}

/**
 * 新增零售商批号
 * @param {Object} retaBatch 零售商批号表单对象，字段与后端RetaBatch实体保持一致
 * @returns {Promise} Result，操作成功无返回data
 * POST请求，后端自动绑定当前登录企业nodeId
 * 接口地址：/api/node/retaBatch/add
 */
export function addRetaBatch(retaBatch) {
  return nodeRequest({
    url: '/api/node/retaBatch/add',
    method: 'POST',
    data: retaBatch
  })
}

/**
 * 修改零售商批号信息（仅新建状态允许修改）
 * @param {Object} retaBatch 编辑完成的完整批号表单数据
 * @returns {Promise} Result，操作成功无返回data
 * PUT请求
 * 接口地址：/api/node/retaBatch/update
 */
export function updateRetaBatch(retaBatch) {
  return nodeRequest({
    url: '/api/node/retaBatch/update',
    method: 'PUT',
    data: retaBatch
  })
}

/**
 * 删除指定零售商批号（仅新建状态允许删除）
 * @param {Number} rbId 零售商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * DELETE路径传参
 * 接口地址：/api/node/retaBatch/delete/{rbId}
 */
export function deleteRetaBatch(rbId) {
  return nodeRequest({
    url: `/api/node/retaBatch/delete/${rbId}`,
    method: 'DELETE'
  })
}

/**
 * 零售商批号下架操作，批号状态改为4‑已下架
 * @param {Number} rbId 零售商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/retaBatch/offShelve/{rbId}
 */
export function offShelveRetaBatch(rbId) {
  return nodeRequest({
    url: `/api/node/retaBatch/offShelve/${rbId}`,
    method: 'PUT'
  })
}

/**
 * 零售商向上游批发商发送进场确认请求
 * 批号状态由1‑新建变更为2‑待确认，等待批发商审核确认
 * @param {Number} rbId 当前零售商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/retaBatch/sendConfirmReq/{rbId}
 */
export function sendRetaConfirmRequest(rbId) {
  return nodeRequest({
    url: `/api/node/retaBatch/sendConfirmReq/${rbId}`,
    method: 'PUT'
  })
}
