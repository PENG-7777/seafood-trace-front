// src/api/node/login.js
// 流通结点端：企业注册、登录、修改密码、获取上游企业下拉列表接口请求文件
// 引入流通结点专属axios实例（baseURL前缀 /node-api，自动携带结点token）
import nodeRequest from '@/utils/request'

/**
 * 流通企业注册接口
 * 无需Token，对外开放
 * 注册完成账号状态默认为【待审核】，必须管理员后台审核通过才能登录
 * @param {Object} registerForm 注册表单对象
 * @param {string} registerForm.code 企业登录编码(账号)
 * @param {string} registerForm.password 明文登录密码
 * @param {string} registerForm.name 企业名称
 * @param {number} registerForm.type 企业类型：1捕捞,2养殖,3冷冻加工,4批发商,5零售商
 * @param {number} registerForm.provId 省份id
 * @param {number} registerForm.cityId 城市id
 * @param {string} registerForm.address 详细地址
 * @param {string} registerForm.businessId 营业执照编号
 * @param {string} registerForm.fishingLic 渔业捕捞许可证编号(捕捞企业)
 * @param {string} registerForm.aquacultureLic 水域滩涂养殖证编号(养殖企业)
 * @param {string} registerForm.foodBusinessLic 食品经营许可证编号
 * @param {string} registerForm.corporation 法定代表人
 * @param {string} registerForm.telephone 企业联系电话
 * @param {string} registerForm.remarks 备注
 * @returns Promise 返回后端Result对象，无data返回
 * 请求地址：POST /node-api/api/node/register
 */
export function nodeRegister(registerForm) {
  return nodeRequest({
    url: '/node/register',
    method: 'POST',
    data: registerForm
  })
}

/**
 * 流通企业登录接口
 * 接口放行无需Token，后端使用@Valid做参数校验
 * 业务限制：只有status=2【已通过】账号可以登录；待审核、禁用账号会抛出业务异常
 * @param {Object} loginForm 登录表单对象
 * @param {string} loginForm.code 企业登录编码
 * @param {string} loginForm.password 明文密码
 * @returns Promise 返回后端Result对象，data包含token、nodeId、nodeType、nodeName
 * 请求地址：POST /node-api/api/node/login
 */
export function nodeLogin(loginForm) {
  return nodeRequest({
    url: '/node/login',
    method: 'POST',
    data: loginForm
  })
}

/**
 * 修改企业账号密码接口
 * 请求头自动携带登录返回的token，后端拦截器解析nodeId
 * @param {Object} pwdForm 密码修改参数
 * @param {string} pwdForm.oldPwd 旧密码
 * @param {string} pwdForm.newPwd 新密码
 * @param {string} pwdForm.confirmPwd 确认密码
 * @returns Promise 返回Result，成功无返回data
 * 请求地址：POST /node-api/api/node/updatePwd
 */
export function updateNodePassword(pwdForm) {
  return nodeRequest({
    url: '/node/updatePwd',
    method: 'POST',
    data: pwdForm
  })
}

/**
 * 获取当前企业类型对应的全部上游企业下拉列表（一级联动下拉）
 * 后端自动过滤，只返回status=2【已审核通过】的上游企业
 * @param {number} targetNodeType 当前登录企业类型编码(3冷冻加工 /4批发商 /5零售商)
 * @returns Promise<Result<NodeInfo[]>> 上游企业信息集合，用于下拉选择
 * 请求地址：GET /node-api/api/node/getUpstreamNodeList/{targetNodeType}
 */
export function getUpstreamNodeList(targetNodeType) {
  return nodeRequest({
    url: `/node/getUpstreamNodeList/${targetNodeType}`,
    method: 'GET'
  })
}
