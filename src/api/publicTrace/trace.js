// 导入【公开无鉴权】请求实例
import publicRequest from '@/utils/publicRequest'

/**
 * 根据溯源标识码查询海产品完整产业链溯源信息
 * @param {String} sourceId 溯源编号
 * @returns {Promise} Result<TraceVO> 返回捕捞、养殖、冷冻加工、批发、零售全链路溯源数据
 * GET请求，公开接口无需携带Token
 * 接口完整地址：http://127.0.0.1:8082/api/public/trace/query
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
