// src/store/nodeUser.js
// Pinia状态管理仓库：流通结点登录用户信息
// 保存企业token、企业ID、企业名称、企业类型，刷新页面数据持久化到localStorage
import { defineStore } from 'pinia'

export const useNodeUserStore = defineStore('nodeUser', {
  // ========== 状态定义 ==========
  state: () => ({
    // 登录令牌，请求头Authorization使用 Bearer + token
    token: '',
    // 当前登录企业编号 nodeId
    nodeId: null,
    // 当前登录企业名称 nodeName
    nodeName: '',
    // 企业类型：捕捞企业/海水养殖企业/冷冻加工企业/批发商/零售商
    nodeType: ''
  }),

  // ========== getters 计算属性 ==========
  getters: {
    // （isLoggedIn 已移到 actions，因为路由守卫用函数方式调用）
  },

  // ========== actions：修改状态的业务方法 ==========
  actions: {
    /**
     * 判断企业是否登录：token不为空代表已登录
     * 注意：这里写成 action（函数），路由守卫中用 nodeStore.isLoggedIn() 调用
     * @returns {Boolean} true=已登录 false=未登录
     */
    isLoggedIn() {
      return !!this.token
    },

    /**
     * 保存登录后的企业完整信息
     * @param {Object} loginData 后端登录接口返回data对象 {token,nodeId,nodeName,nodeType}
     */
    setUserInfo(loginData) {
      this.token = loginData.token
      this.nodeId = loginData.nodeId
      this.nodeName = loginData.nodeName
      // 修复原代码笔误：nodeType 应取 loginData.nodeType，不是 loginData.nodeName
      this.nodeType = loginData.nodeType
    },

    /**
     * 清除用户数据，执行退出登录
     */
    logout() {
      this.token = ''
      this.nodeId = null
      this.nodeName = ''
      this.nodeType = ''
    }
  },

  // 开启持久化：刷新浏览器不会丢失登录信息
  persist: {
    storage: localStorage,
    paths: ['token', 'nodeId', 'nodeName', 'nodeType']
  }
})
