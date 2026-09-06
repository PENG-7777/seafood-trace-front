// 消费者公开溯源查询接口文件
// 公开接口无需token鉴权，使用独立的公共axios实例publicRequest
import publicRequest from '@/utils/publicRequest'

/**
 * 根据溯源标识码查询海产品完整产业链溯源信息
 * @param {String} sourceId 32位溯源编号
 * @returns {Promise} Result<TraceVO> 返回捕捞、养殖、冷冻加工、批发、零售全链路溯源数据
 * GET请求，接口无需携带Token，拦截器直接放行
 * 接口地址：/api/public/trace/query
 */
export function queryTraceInfo(sourceId) {
  return publicRequest({
    url: '/api/public/trace/query',
    method: 'GET',
    params: {
      sourceId: sourceId
    }
  })
}
