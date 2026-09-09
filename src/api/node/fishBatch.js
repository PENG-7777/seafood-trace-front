// 捕捞企业批号相关接口文件
// 引入流通结点axios实例nodeRequest，请求自动携带登录后的token
import nodeRequest from '@/utils/request'
/**
 * 获取当前登录捕捞企业自身的批号列表
 * @returns {Promise} Result<List<FishBatch>> 批号数据集合
 * GET 请求，后端自动从request获取登录企业nodeId，前端无需传参
 * 接口地址：/api/node/fishBatch/list
 */
export function getMyBatchList() {
  return nodeRequest({
    url: '/node/fishBatch/list',
    method: 'GET'
  })
}
/**
 * 新增捕捞批号
 * @param {Object} fishBatch 批号表单实体（和后端FishBatch字段一一对应）
 * @returns {Promise} Result，成功无返回data
 * POST 请求，后端自动获取登录企业nodeId
 * 接口地址：/api/node/fishBatch/add
 */
export function addFishBatch(fishBatch) {
  return nodeRequest({
    url: '/node/fishBatch/add',
    method: 'POST',
    data: fishBatch
  })
}
/**
 * 修改捕捞批号信息
 * @param {Object} fishBatch 编辑后的批号完整表单数据
 * @returns {Promise} Result，成功无返回data
 * PUT 请求
 * 接口地址：/api/node/fishBatch/update
 */
export function updateFishBatch(fishBatch) {
  return nodeRequest({
    url: '/node/fishBatch/update',
    method: 'PUT',
    data: fishBatch
  })
}
/**
 * 删除指定捕捞批号
 * @param {Number} fbId 捕捞批号主键id
 * @returns {Promise} Result，成功无返回data
 * DELETE路径传参
 * 接口地址：/api/node/fishBatch/delete/{fbId}
 */
export function deleteFishBatch(fbId) {
  return nodeRequest({
    url: `/node/fishBatch/delete/${fbId}`,
    method: 'DELETE'
  })
}
/**
 * 批号下架操作
 * @param {Number} fbId 捕捞批号主键id
 * @returns {Promise} Result，成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/fishBatch/offShelve/{fbId}
 */
export function offShelveFishBatch(fbId) {
  return nodeRequest({
    url: `/node/fishBatch/offShelve/${fbId}`,
    method: 'PUT'
  })
}
/**
 * 获取下游冷冻加工进场申请列表（新增接口）
 * @returns {Promise} Result<List<ApplyVO>>
 * GET请求，自动获取当前登录捕捞企业ID
 * 接口地址：/node/fishBatch/getProcessApplyList
 */
export function getProcessApplyList() {
  return nodeRequest({
    url: '/node/fishBatch/getProcessApplyList',
    method: 'GET'
  })
}
/**
 * 捕捞企业确认冷冻加工进场申请
 * @param {Number} processBatchId 冷冻加工批号主键id
 * @returns {Promise} Result，成功无返回data
 * PUT路径传参
 * 接口地址：/node/fishBatch/confirm/{processBatchId}
 */
export function confirmProcessBatch(processBatchId) {
  return nodeRequest({
    url: `/node/fishBatch/confirm/${processBatchId}`,
    method: 'PUT'
  })
}
