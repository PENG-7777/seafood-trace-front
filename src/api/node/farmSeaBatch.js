// 养殖企业批号相关接口文件
// 引入流通结点axios实例nodeRequest，请求自动携带登录后的token
import nodeRequest from '@/utils/request'

/**
 * 获取当前登录养殖企业自身的批号列表
 * @returns {Promise} Result<List<FarmSeaBatch>> 批号数据集合
 * GET 请求，后端自动从request获取登录企业nodeId，前端无需传参
 * 接口地址：/node/farmSeaBatch/list
 */
export function getMyFarmSeaBatchList() {
  return nodeRequest({
    url: '/node/farmSeaBatch/list',
    method: 'GET'
  })
}

/**
 * 新增养殖批号
 * @param {Object} farmSeaBatch 批号表单实体（和后端FarmSeaBatch字段一一对应）
 * @returns {Promise} Result，成功无返回data
 * POST 请求，后端自动获取登录企业nodeId
 * 接口地址：/node/farmSeaBatch/add
 */
export function addFarmSeaBatch(farmSeaBatch) {
  return nodeRequest({
    url: '/node/farmSeaBatch/add',
    method: 'POST',
    data: farmSeaBatch
  })
}

/**
 * 修改养殖批号信息
 * @param {Object} farmSeaBatch 编辑后的批号完整表单数据
 * @returns {Promise} Result，成功无返回data
 * PUT 请求
 * 接口地址：/node/farmSeaBatch/update
 */
export function updateFarmSeaBatch(farmSeaBatch) {
  return nodeRequest({
    url: '/node/farmSeaBatch/update',
    method: 'PUT',
    data: farmSeaBatch
  })
}

/**
 * 删除指定养殖批号
 * @param {Number} fsbId 养殖批号主键id
 * @returns {Promise} Result，成功无返回data
 * DELETE路径传参
 * 接口地址：/node/farmSeaBatch/delete/{fsbId}
 */
export function deleteFarmSeaBatch(fsbId) {
  return nodeRequest({
    url: `/node/farmSeaBatch/delete/${fsbId}`,
    method: 'DELETE'
  })
}

/**
 * 批号下架操作
 * @param {Number} fsbId 养殖批号主键id
 * @returns {Promise} Result，成功无返回data
 * PUT路径传参
 * 接口地址：/node/farmSeaBatch/offShelve/{fsbId}
 */
export function offShelveFarmSeaBatch(fsbId) {
  return nodeRequest({
    url: `/node/farmSeaBatch/offShelve/${fsbId}`,
    method: 'PUT'
  })
}

/**
 * 获取下游冷冻加工进场申请列表
 * @returns {Promise} Result<List<ApplyVO>>
 * GET请求，自动获取当前登录养殖企业ID
 * 接口地址：/node/farmSeaBatch/getProcessApplyList
 */
export function getFarmProcessApplyList() {
  return nodeRequest({
    url: '/node/farmSeaBatch/getProcessApplyList',
    method: 'GET'
  })
}

/**
 * 养殖企业确认冷冻加工进场申请
 * @param {Number} processBatchId 冷冻加工批号主键id
 * @returns {Promise} Result，成功无返回data
 * PUT路径传参
 * 接口地址：/node/farmSeaBatch/confirm/{processBatchId}
 */
export function confirmFarmProcessBatch(processBatchId) {
  return nodeRequest({
    url: `/node/farmSeaBatch/confirm/${processBatchId}`,
    method: 'PUT'
  })
}
