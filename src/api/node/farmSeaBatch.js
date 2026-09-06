// 海水养殖企业批号接口文件
// 引入流通结点axios实例nodeRequest，请求自动携带登录后的token鉴权头
import nodeRequest from '@/utils/request'

/**
 * 获取当前登录海水养殖企业自身的批号列表
 * @returns {Promise} Result<List<FarmSeaBatch>> 返回养殖批号数据集合
 * GET请求，后端自动从token解析获取登录企业nodeId，前端无需传递id参数
 * 接口地址：/api/node/farmSeaBatch/list
 */
export function getFarmSeaBatchList() {
  return nodeRequest({
    url: '/api/node/farmSeaBatch/list',
    method: 'GET'
  })
}

/**
 * 新增海水养殖批号
 * @param {Object} farmSeaBatch 养殖批号表单实体，字段与后端FarmSeaBatch实体一一对应
 * @returns {Promise} Result，操作成功无返回data
 * POST请求，后端自动获取当前登录企业nodeId绑定数据
 * 接口地址：/api/node/farmSeaBatch/add
 */
export function addFarmSeaBatch(farmSeaBatch) {
  return nodeRequest({
    url: '/api/node/farmSeaBatch/add',
    method: 'POST',
    data: farmSeaBatch
  })
}

/**
 * 修改海水养殖批号信息
 * @param {Object} farmSeaBatch 编辑完成的完整批号表单数据
 * @returns {Promise} Result，操作成功无返回data
 * PUT请求
 * 接口地址：/api/node/farmSeaBatch/update
 */
export function updateFarmSeaBatch(farmSeaBatch) {
  return nodeRequest({
    url: '/api/node/farmSeaBatch/update',
    method: 'PUT',
    data: farmSeaBatch
  })
}

/**
 * 删除指定海水养殖批号
 * @param {Number} fsbId 养殖批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * DELETE路径传参
 * 接口地址：/api/node/farmSeaBatch/delete/{fsbId}
 */
export function deleteFarmSeaBatch(fsbId) {
  return nodeRequest({
    url: `/api/node/farmSeaBatch/delete/${fsbId}`,
    method: 'DELETE'
  })
}

/**
 * 海水养殖批号下架操作
 * @param {Number} fsbId 养殖批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/farmSeaBatch/offShelve/{fsbId}
 */
export function offShelveFarmSeaBatch(fsbId) {
  return nodeRequest({
    url: `/api/node/farmSeaBatch/offShelve/${fsbId}`,
    method: 'PUT'
  })
}

/**
 * 海水养殖企业确认冷冻加工进场申请
 * @param {Number} processBatchId 冷冻加工批号主键id
 * @returns {Promise} Result，操作成功无返回data
 * PUT路径传参
 * 接口地址：/api/node/farmSeaBatch/confirm/{processBatchId}
 */
export function confirmFarmProcessBatch(processBatchId) {
  return nodeRequest({
    url: `/api/node/farmSeaBatch/confirm/${processBatchId}`,
    method: 'PUT'
  })
}
