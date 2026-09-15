// 导入【公开无鉴权】请求实例（已配置 baseURL，无需携带 Token）
import publicRequest from '@/utils/publicRequest'

/**
 * 根据溯源标识码查询海产品完整产业链溯源信息
 * @param {String} sourceId 溯源编号
 * @returns {Promise} Result<TraceVO> 返回捕捞、养殖、冷冻加工、批发、零售全链路溯源数据
 * GET 请求，公开接口无需身份校验
 * 后端完整地址：http://127.0.0.1:8082/api/public/trace/query
 */
export function queryTraceInfo(sourceId) {
  return publicRequest({
    url: '/public/trace/query',
    method: 'GET',
    params: {
      sourceId: sourceId
    }
  })
}

/**
 * 根据溯源编号生成溯源二维码 Base64 字符串
 * @param {String} sourceId 溯源编号
 * @returns {Promise} Result<String> 返回二维码图片纯 Base64 字符串（不带 data:image 前缀）
 * GET 请求，公开接口无需身份校验
 * 后端完整地址：http://127.0.0.1:8082/api/public/trace/qrCode
 * 前端渲染注意：使用时需自行拼接图片前缀 `data:image/png;base64,${base64字符串}`
 */
export function getTraceQrCode(sourceId) {
  return publicRequest({
    url: '/public/trace/qrCode',
    method: 'GET',
    params: {
      sourceId: sourceId
    }
  })
}
