// 流通结点端：企业登录、修改密码接口请求文件
// 引入流通结点专属axios实例（baseURL前缀 /node-api，自动携带结点token）
import nodeRequest from '@/utils/request'

/**
 * 流通企业登录接口
 * @param {Object} loginForm 登录表单对象
 * @param {string} loginForm.code 企业登录编码
 * @param {string} loginForm.password 明文密码
 * @returns Promise 返回后端Result对象，data包含token、nodeId、nodeType、nodeName
 * 请求地址：POST /node-api/api/node/login
 */
export function nodeLogin(loginForm) {
  return nodeRequest({
    url: '/api/node/login',
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
    url: '/api/node/updatePwd',
    method: 'POST',
    data: pwdForm
  })
}
