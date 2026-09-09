<template>
  <div class="password-page">
    <!-- 返回箭头 + 页面标题 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
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
          v-model="form.oldPwd"
          type="password"
          class="form-input"
          placeholder="请输入旧密码"
        />
      </div>
      <!-- 新密码输入框 -->
      <div class="form-item">
        <label class="form-label">新密码 <span class="required">*</span></label>
        <input
          v-model="form.newPwd"
          type="password"
          class="form-input"
          placeholder="请输入新密码"
        />
      </div>
      <!-- 确认新密码输入框 -->
      <div class="form-item">
        <label class="form-label">再次输入新密码 <span class="required">*</span></label>
        <input
          v-model="form.confirmPwd"
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
      <!-- 【我的】点击触发动态跳转方法 goMinePage -->
      <div class="tab-item" @click="goMinePage">
        <div class="icon-my"></div>
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
import { storeToRefs } from 'pinia'
// 引入axios请求工具
import request from '@/utils/request'

// 路由实例
const router = useRouter()
// 用户pinia实例
const nodeStore = useNodeUserStore()
// 响应式取出当前登录企业类型 nodeType
const { nodeType } = storeToRefs(nodeStore)

// 表单绑定数据：字段名严格和后端UpdatePwdVO对齐
const form = ref({
  oldPwd: '',      // 旧密码
  newPwd: '',      // 新密码
  confirmPwd: ''   // 二次确认密码
})

/**
 * 根据企业类型动态跳转到对应批号管理列表页
 * nodeType枚举定义：
 * 1 捕捞企业     → fishBatch/list
 * 2 海水养殖企业 → farmSeaBatch/list
 * 3 冷冻加工企业 → processBatch/list
 * 4 批发流通企业 → wholBatch/list
 * 5 零售终端企业 → retaBatch/list
 */
const goMinePage = () => {
  let targetPath = ''
  switch (nodeType.value) {
    case 1:
      targetPath = '/node/fishBatch/list'
      break
    case 2:
      targetPath = '/node/farmSeaBatch/list'
      break
    case 3:
      targetPath = '/node/processBatch/list'
      break
    case 4:
      targetPath = '/node/wholBatch/list'
      break
    case 5:
      targetPath = '/node/retaBatch/list'
      break
    default:
      ElMessage.warning('企业类型异常，请重新登录')
      return
  }
  router.push(targetPath)
}

/**
 * 提交修改密码
 * 接口地址 /node/updatePwd，提交字段与后端VO对齐
 */
const handleUpdatePwd = async () => {
  // 1.前端非空校验
  if (!form.value.oldPwd) {
    ElMessage.warning('请输入旧密码')
    return
  }
  if (!form.value.newPwd) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (!form.value.confirmPwd) {
    ElMessage.warning('请再次输入新密码')
    return
  }
  // 校验两次输入密码是否一致
  if (form.value.newPwd !== form.value.confirmPwd) {
    ElMessage.warning('两次输入的新密码不一致！')
    return
  }
  try {
    // 请求后端修改密码接口：地址和后端 @PostMapping("/updatePwd") 对齐
    const res = await request.post('/node/updatePwd', {
      oldPwd: form.value.oldPwd,
      newPwd: form.value.newPwd,
      confirmPwd: form.value.confirmPwd
    })
    if (res.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      // 修改成功直接退出登录
      nodeStore.logout()
      router.push('/node/login')
    } else {
      ElMessage.error(res.msg || '密码修改失败')
    }
  } catch (err) {
    console.error('修改密码失败', err)
    ElMessage.error('修改密码失败，请检查旧密码是否正确')
  }
}

/**
 * 退出登录逻辑
 * 清空token与用户信息，跳转登录页
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
  height: 50px;
  font-size: 22px;
  position: relative;
  font-weight: bold;
}
/* 返回箭头图标样式 */
.back-icon {
  position: absolute;
  left: 20px;
  width: 18px;
  height: 18px;
  background: url('/images/back.png') no-repeat center;
  background-size: contain;
  cursor: pointer;
}
.title {
  width: 100%;
  text-align: center;
  color: #333;
}
/* 顶部横幅banner */
.banner-block {
  height: 160px;
  background: #48bc70 url('@/assets/banner-food.png') no-repeat right center;
  background-size: contain;
  padding: 20px 20px;
}
.banner-text h1 {
  font-size: 40px;
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
  padding: 10px 30px;
  flex: 1;
}
/* 每一行表单 */
.form-item {
  margin-bottom: 6px;
}
.form-label {
  font-size: 18px;
  color: #666;
  display: block;
  margin-bottom:6px;
}
.required {
  color: red;
}
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:18px;
  padding:8px 0;
  outline: none;
}
/* 更新密码绿色按钮 */
.btn-update {
  width: 100%;
  height: 40px;
  background-color: #39b568;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 22px;
  margin-top:10px;
  margin-bottom:10px;
  cursor: pointer;
}
/* 退出登录红色按钮 */
.btn-logout {
  width: 100%;
  height: 40px;
  background-color: #f46b6b;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 22px;
  cursor: pointer;
}
/* 底部导航栏 */
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: 60px;
  align-items: center;
  border-top:1px solid #eee;
}
.tab-item {
  display:flex;
  flex-direction:column;
  align-items:center;
  font-size:15px;
  color:#999;
  gap:1px;
  cursor: pointer;
}
.tab-item.active {
  color:#0052D4;
}
/* 底部导航图标基础尺寸 */
.icon-home,
.icon-my,
.icon-pwd {
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
/* 默认状态图标路径（public/images目录） */
.icon-home {
  background-image: url('/images/home.png');
}
.icon-my {
  background-image: url('/images/my.png');
}
.icon-pwd {
  background-image: url('/images/change.png');
}
/* active激活状态切换高亮图标 */
.tab-item.active .icon-pwd {
  background-image: url('/images/change-active.png');
}
</style>
