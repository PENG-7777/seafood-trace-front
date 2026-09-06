<template>
  <div class="password-page">
    <!-- 返回箭头 + 页面标题 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()">&lt;</div>
      <div class="title">修改密码</div>
    </div>

    <!-- 顶部Banner图片区域 -->
    <div class="banner-block">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="form-wrap">
      <!-- 旧密码输入框 -->
      <div class="form-item">
        <label class="form-label">旧密码 <span class="required">*</span></label>
        <input
          v-model="form.oldPassword"
          type="password"
          class="form-input"
          placeholder="请输入旧密码"
        />
      </div>
      <!-- 新密码输入框 -->
      <div class="form-item">
        <label class="form-label">新密码 <span class="required">*</span></label>
        <input
          v-model="form.newPassword"
          type="password"
          class="form-input"
          placeholder="请输入新密码"
        />
      </div>
      <!-- 确认新密码输入框 -->
      <div class="form-item">
        <label class="form-label">再次输入新密码 <span class="required">*</span></label>
        <input
          v-model="form.rePassword"
          type="password"
          class="form-input"
          placeholder="请再次输入新密码"
        />
      </div>

      <!-- 更新密码按钮 -->
      <button class="btn-update" @click="handleUpdatePwd">更新密码</button>
      <!-- 退出登录按钮 -->
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </div>

    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <div class="tab-item" @click="$router.push('/node/home')">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <div class="tab-item" @click="$router.push('/node/mine')">
        <div class="icon-user"></div>
        <span>我的</span>
      </div>
      <div class="tab-item active">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// 引入node端用户状态管理store
import { useNodeUserStore } from '@/store/nodeUser'
// 引入axios请求工具
import request from '@/utils/request'

// 路由实例
const router = useRouter()
// 用户pinia实例
const nodeStore = useNodeUserStore()

// 表单绑定数据
const form = ref({
  oldPassword: '', // 旧密码
  newPassword: '', // 新密码
  rePassword: ''   // 二次确认密码
})

/**
 * 提交修改密码
 */
const handleUpdatePwd = async () => {
  // 1.前端非空校验
  if (!form.value.oldPassword) {
    ElMessage.warning('请输入旧密码')
    return
  }
  if (!form.value.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (!form.value.rePassword) {
    ElMessage.warning('请再次输入新密码')
    return
  }
  // 校验两次输入密码是否一致
  if (form.value.newPassword !== form.value.rePassword) {
    ElMessage.warning('两次输入的新密码不一致！')
    return
  }

  try {
    // 请求后端修改密码接口
    const res = await request.post('/node/updatePassword', {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    })
    if (res.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      // 修改成功直接退出登录
      nodeStore.logout()
      router.push('/node/login')
    }
  } catch (err) {
    console.error('修改密码失败', err)
  }
}

/**
 * 退出登录逻辑
 */
const handleLogout = () => {
  // 清空token和用户信息
  nodeStore.logout()
  ElMessage.success('已退出登录')
  // 跳转到企业端登录页
  router.push('/node/login')
}
</script>

<style scoped>
/* 页面整体布局 */
.password-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
/* 顶部标题栏 */
.page-header {
  display: flex;
  align-items: center;
  height: 80px;
  font-size: 32px;
  position: relative;
}
.back-icon {
  position: absolute;
  left: 20px;
  font-size: 36px;
  color: #333;
}
.title {
  width: 100%;
  text-align: center;
  color: #333;
}
/* 顶部横幅banner */
.banner-block {
  height: 240px;
  background: #48bc70 url('@/assets/banner-food.png') no-repeat right center;
  background-size: contain;
  padding: 30px 20px;
}
.banner-text h1 {
  font-size: 60px;
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
}
.banner-text p {
  background: rgba(0,80,40,0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}
/* 表单外层容器 */
.form-wrap {
  padding: 40px 30px;
  flex: 1;
}
/* 每一行表单 */
.form-item {
  margin-bottom: 36px;
}
.form-label {
  font-size: 30px;
  color: #666;
  display: block;
  margin-bottom:12px;
}
.required {
  color: red;
}
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:32px;
  padding:12px 0;
  outline: none;
}
/* 更新密码绿色按钮 */
.btn-update {
  width: 100%;
  height: 90px;
  background-color: #39b568;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 34px;
  margin-top: 20px;
  margin-bottom:24px;
}
/* 退出登录红色按钮 */
.btn-logout {
  width: 100%;
  height: 90px;
  background-color: #f46b6b;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 34px;
}
/* 底部导航栏 */
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: 120px;
  align-items: center;
  border-top:1px solid #eee;
}
.tab-item {
  display:flex;
  flex-direction:column;
  align-items:center;
  font-size:24px;
  color:#999;
}
.tab-item.active {
  color:#0052D4;
}
</style>
