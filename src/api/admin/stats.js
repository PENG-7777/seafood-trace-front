/**
 * 数据统计看板接口模块
 * 功能：获取管理员端全部统计图表数据
 * 包含：企业注册趋势、省分布、企业类型分布、省统计
 */
import request from '@/utils/request'

/**
 * 获取数据统计总览（一次性返回4组图表数据）
 * @param {Object} params 可选筛选参数
 * @param {String} params.startDate 趋势开始日期 yyyy-MM-dd
 * @param {String} params.endDate 趋势结束日期 yyyy-MM-dd
 */
export function getDashboardStats(params) {
  return request({
    url: '/node/stats/dashboard',
    method: 'get',
    params
  })
}
