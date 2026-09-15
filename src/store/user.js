import { defineStore } from 'pinia'
import { login } from '@/api/admin/login'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: ''
  }),
  persist: true,
  actions: {
    async loginAction(form) {
      const res = await login(form)
      if (res.code === 200) {
        this.token = res.data.token
        this.username = res.data.username
        return true
      }
      return false
    },
    logoutAction() {
      this.token = ''
      this.username = ''
    },
    // 新增：判断是否已登录，供路由守卫调用
    isLoggedIn() {
      return this.token && this.token.trim().length > 0
    }
  }
})