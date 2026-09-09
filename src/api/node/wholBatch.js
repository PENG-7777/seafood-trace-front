// src/api/node/wholBatch.js
// 流通结点端 - 批发商批号管理接口文件
// 后端控制器：WholBatchController
// 请求自动拼接前缀 /node-api，nodeRequest拦截器自动携带登录Token完成鉴权
import nodeRequest from '@/utils/request'

/**
 * 获取当前登录批发商企业自身的批号列表
 * @returns {Promise} Result<List<WholBatch>> 返回批发商批号数据集合
 * GET请求，后端通过Token自动解析登录企业nodeId，前端无需传递id参数
 * 接口完整地址：GET /node-api/api/node/wholBatch/list
 */
export function getWholBatchList() {
  return nodeRequest({
    url: '/node/wholBatch/list',
    method: 'GET'
  })
}

/**
 * 新增批发商批号
 * @param {Object} wholBatch 批发商批号表单对象，字段与后端WholBatch实体保持一致
 * @returns {Promise} Result，操作成功无返回data
 * POST请求，后端自动绑定当前登录企业nodeId做数据权限控制
 * 接口完整地址：POST /node-api/api/node/wholBatch/add
 */
export function addWholBatch(wholBatch) {
  return nodeRequest({
    url: '/node/wholBatch/add',
    method: 'POST',
    data: wholBatch
  })
}

/**
 * 修改批发商批号信息（仅状态为【1‑新建】时允许修改）
 * @param {Object} wholBatch 编辑完成的完整批号表单数据
 * @returns {Promise} Result，操作成功无返回data
 * PUT请求，后端校验当前登录企业权限
 * 接口完整地址：PUT /node-api/api/node/wholBatch/update
 */
export function updateWholBatch(wholBatch) {
  return nodeRequest({
    url: '/node/wholBatch/update',
    method: 'PUT',
    data: wholBatch
  })
}

/**
 * 删除指定批发商批号（仅状态为【1‑新建】时允许删除）
 * @param {Number} wbId 批发商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * DELETE路径传参，后端校验企业数据权限
 * 接口完整地址：DELETE /node-api/api/node/wholBatch/delete/{wbId}
 */
export function deleteWholBatch(wbId) {
  return nodeRequest({
    url: `/node/wholBatch/delete/${wbId}`,
    method: 'DELETE'
  })
}

/**
 * 批发商批号下架操作，批号状态改为已下架
 * @param {Number} wbId 批发商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口完整地址：PUT /node-api/api/node/wholBatch/offShelve/{wbId}
 */
export function offShelveWholBatch(wbId) {
  return nodeRequest({
    url: `/node/wholBatch/offShelve/${wbId}`,
    method: 'PUT'
  })
}

/**
 * 批发商向上游冷冻加工企业发送进场确认请求
 * 批号状态由1‑新建变更为2‑待确认，等待上游冷冻加工企业审核确认
 * @param {Number} wbId 当前批发商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口完整地址：PUT /node-api/api/node/wholBatch/sendConfirmReq/{wbId}
 */
export function sendWholConfirmRequest(wbId) {
  return nodeRequest({
    url: `/node/wholBatch/sendConfirmReq/${wbId}`,
    method: 'PUT'
  })
}

/**
 * 批发商审核确认零售商进场申请，后端自动生成溯源码与二维码
 * @param {Number} retaBatchId 零售商批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参，后端校验当前登录批发商企业权限
 * 接口完整地址：PUT /node-api/api/node/wholBatch/confirm/{retaBatchId}
 */
export function confirmRetaBatch(retaBatchId) {
  return nodeRequest({
    url: `/node/wholBatch/confirm/${retaBatchId}`,
    method: 'PUT'
  })
}

/**
 * 根据上游冷冻加工企业ID，下拉查询该企业已确认的成品批号（前端二级联动选择上游原料）
 * @param {Number} sourceNodeId 上游冷冻加工企业编号
 * @returns {Promise} Result<List<SourceBatchVO>> 返回下拉选项VO集合
 * GET路径传参
 * 接口完整地址：GET /node-api/api/node/wholBatch/getUpstreamProcessBatch/{sourceNodeId}
 */
export function getUpstreamProcessBatch(sourceNodeId) {
  return nodeRequest({
    url: `/node/wholBatch/getUpstreamProcessBatch/${sourceNodeId}`,
    method: 'GET'
  })
}

/**
 * 获取零售商提交给当前批发商的进场申请列表
 * @returns {Promise} Result<List<RetailApplyVO>>
 * GET请求，后端自动获取登录批发商企业
 * 接口完整地址：GET /node-api/api/node/wholBatch/getRetaApplyList
 */
export function getRetaApplyList() {
  return nodeRequest({
    url: '/node/wholBatch/getRetaApplyList',
    method: 'GET'
  })
}

