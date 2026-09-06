// 冷冻加工企业批号管理接口文件
// 引入流通结点axios实例nodeRequest，请求拦截器自动携带登录Token完成鉴权
import nodeRequest from '@/utils/request'

/**
 * 获取当前登录冷冻加工企业自身的加工批号列表
 * @returns {Promise} Result<List<ProcessBatch>> 返回加工批号集合
 * GET请求，后端通过Token自动解析登录企业nodeId，前端无需传递id
 * 接口地址：/api/node/processBatch/list
 */
export function getProcessBatchList() {
  return nodeRequest({
    url: '/api/node/processBatch/list',
    method: 'GET'
  })
}

/**
 * 新增冷冻加工批号
 * @param {Object} processBatch 加工批号表单对象，字段与后端ProcessBatch实体保持一致
 * @returns {Promise} Result，操作成功无返回data
 * POST请求，后端自动绑定当前登录企业nodeId
 * 接口地址：/api/node/processBatch/add
 */
export function addProcessBatch(processBatch) {
  return nodeRequest({
    url: '/api/node/processBatch/add',
    method: 'POST',
    data: processBatch
  })
}

/**
 * 修改冷冻加工批号信息
 * @param {Object} processBatch 编辑完成的完整批号表单数据
 * @returns {Promise} Result，操作成功无返回data
 * PUT请求
 * 接口地址：/api/node/processBatch/update
 */
export function updateProcessBatch(processBatch) {
  return nodeRequest({
    url: '/api/node/processBatch/update',
    method: 'PUT',
    data: processBatch
  })
}

/**
 * 删除指定冷冻加工批号
 * @param {Number} pbId 加工批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * DELETE路径传参
 * 接口地址：/api/node/processBatch/delete/{pbId}
 */
export function deleteProcessBatch(pbId) {
  return nodeRequest({
    url: `/api/node/processBatch/delete/${pbId}`,
    method: 'DELETE'
  })
}

/**
 * 冷冻加工批号下架操作
 * @param {Number} pbId 加工批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/processBatch/offShelve/{pbId}
 */
export function offShelveProcessBatch(pbId) {
  return nodeRequest({
    url: `/api/node/processBatch/offShelve/${pbId}`,
    method: 'PUT'
  })
}

/**
 * 向上游捕捞/养殖企业发送进场确认请求，批号状态变更为待上游确认
 * @param {Number} pbId 当前冷冻加工批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/processBatch/sendConfirmReq/{pbId}
 */
export function sendConfirmRequest(pbId) {
  return nodeRequest({
    url: `/api/node/processBatch/sendConfirmReq/${pbId}`,
    method: 'PUT'
  })
}

/**
 * 冷冻加工企业确认批发商进场申请
 * @param {Number} wholBatchId 批发商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/processBatch/confirm/{wholBatchId}
 */
export function confirmWholBatch(wholBatchId) {
  return nodeRequest({
    url: `/api/node/processBatch/confirm/${wholBatchId}`,
    method: 'PUT'
  })
}
