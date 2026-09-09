// src/api/node/processBatch.js
// 流通结点端 - 冷冻加工企业批号管理接口文件
// 后端控制器全类名：com.peng.node.controller.ProcessBatchController
// 请求前缀 /node-api，nodeRequest 请求拦截器自动附加Token完成身份鉴权
import nodeRequest from '@/utils/request'
/**
 * 获取当前登录冷冻加工企业自身的加工批号列表
 * GET 请求
 * 后端通过拦截器从Token解析登录企业nodeId，前端不需要手动传递id
 * 完整请求地址：GET /node-api/api/node/processBatch/list
 * @returns {Promise} Result<List<ProcessBatch>>
 */
export function getProcessBatchList() {
  return nodeRequest({
    url: '/node/processBatch/list',
    method: 'GET'
  })
}
/**
 * 新增冷冻加工批号
 * POST 请求
 * @param {Object} processBatch 表单提交对象，字段和后端ProcessBatch实体对齐
 * @returns {Promise} Result 成功无返回data
 * 完整地址：POST /node-api/api/node/processBatch/add
 */
export function addProcessBatch(processBatch) {
  return nodeRequest({
    url: '/node/processBatch/add',
    method: 'POST',
    data: processBatch
  })
}
/**
 * 修改冷冻加工批号信息
 * 业务限制：仅状态=1【待发布】允许编辑
 * @param {Object} processBatch 完整编辑表单对象（必须携带pbId主键）
 * @returns {Promise} Result
 * PUT /node-api/api/node/processBatch/update
 */
export function updateProcessBatch(processBatch) {
  return nodeRequest({
    url: '/node/processBatch/update',
    method: 'PUT',
    data: processBatch
  })
}
/**
 * 删除冷冻加工批号
 * 业务限制：仅待发布状态可删除
 * @param {Number} pbId 加工批号主键
 * @returns {Promise} Result
 * DELETE /node-api/api/node/processBatch/delete/{pbId}
 */
export function deleteProcessBatch(pbId) {
  return nodeRequest({
    url: `/node/processBatch/delete/${pbId}`,
    method: 'DELETE'
  })
}
/**
 * 批号下架接口，状态修改为已下架
 * @param {Number} pbId 加工批号主键
 * @returns {Promise} Result
 * PUT /node-api/api/node/processBatch/offShelve/{pbId}
 */
export function offShelveProcessBatch(pbId) {
  return nodeRequest({
    url: `/node/processBatch/offShelve/${pbId}`,
    method: 'PUT'
  })
}
/**
 * 向上游源头企业（捕捞/海水养殖）发起进场确认请求
 * 批号状态由【1待发布】变更为【2待上游确认】
 * @param {Number} pbId 加工批号主键
 * @returns {Promise} Result
 * PUT /node-api/api/node/processBatch/sendConfirmReq/{pbId}
 */
export function sendConfirmRequest(pbId) {
  return nodeRequest({
    url: `/node/processBatch/sendConfirmReq/${pbId}`,
    method: 'PUT'
  })
}
/**
 * 冷冻加工企业确认批发商进场申请
 * 修改批发商whol_batch批号状态为【3已确认】
 * @param {Number} wholBatchId 批发商批号主键
 * @returns {Promise} Result
 * PUT /node-api/api/node/processBatch/confirm/{wholBatchId}
 */
export function confirmWholBatch(wholBatchId) {
  return nodeRequest({
    url: `/node/processBatch/confirm/${wholBatchId}`,
    method: 'PUT'
  })
}
/**
 * 获取下游批发企业提交的进场申请列表
 * GET 请求
 * @returns {Promise} Result<List<WholApplyVO>>
 * GET /node-api/api/node/processBatch/getWholApplyList
 */
export function getWholApplyList() {
  return nodeRequest({
    url: '/node/processBatch/getWholApplyList',
    method: 'GET'
  })
}
/**
 * 根据上游企业ID查询该企业已发布的原料批号（二级联动下拉）
 * 后端返回VO字段：sourceBatchId（主键）、batchId（业务批号）、type（品种）
 * @param {Number} sourceNodeId 上游源头企业编号
 * @returns {Promise} Result<List<SourceBatchVO>>
 * GET /node-api/api/node/processBatch/getUpstreamBatch/{sourceNodeId}
 */
export function getUpstreamBatchByNodeId(sourceNodeId) {
  return nodeRequest({
    url: `/node/processBatch/getUpstreamBatch/${sourceNodeId}`,
    method: 'GET'
  })
}
