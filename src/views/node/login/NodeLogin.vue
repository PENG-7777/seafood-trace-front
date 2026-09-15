<template>
  <!-- 全屏登录容器：占满可视窗口，移动端自适应 -->
  <div class="login-page">
    <div class="login-wrap">
      <!-- 标题区域 -->
      <div class="title-area">
        <h1 class="system-title">冷冻海产品溯源系统</h1>
        <div class="sub-title-line">
          <span class="line"></span>
          <span class="sub-text">流通结点端</span>
          <span class="line"></span>
        </div>
      </div>
      <!-- 登录表单卡片：改为半透明，露出底层背景图 -->
      <div class="login-card">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0">
          <!-- 登录编码输入框：prop为code，v-model绑定loginForm.code -->
          <el-form-item prop="code">
            <el-input
              class="custom-input"
              v-model="loginForm.code"
              placeholder="登录编码"
              prefix-icon="User"
              :inputStyle="{ fontSize: '20px' }"
            />
          </el-form-item>
          <!-- 登录密码输入框：文字大小20px，显示隐藏密码功能 -->
          <el-form-item prop="password">
            <el-input
              class="custom-input"
              v-model="loginForm.password"
              type="password"
              placeholder="登录密码"
              size="large"
              prefix-icon="Lock"
              show-password
              :inputStyle="{ fontSize: '20px' }"
            />
          </el-form-item>
          <!-- 登录提交按钮 -->
          <el-form-item>
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              :loading="loginLoading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
          <!-- 注册账号跳转链接 -->
          <el-form-item>
            <div class="register-tip">
              还没有账号？
              <el-link type="primary" :underline="false" @click="goRegister">立即注册</el-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// 导入Pinia流通节点用户仓库，用于保存登录后的企业完整信息
import { useNodeUserStore } from '@/store/nodeUser'
// 导入封装好的axios请求工具
import request from '@/utils/request'

// 获取路由实例，登录成功跳转首页
const router = useRouter()
// 获取表单DOM引用，用于表单校验
const loginFormRef = ref(null)
// 登录加载状态，防止重复点击提交
const loginLoading = ref(false)
// 登录表单绑定数据：字段为code，和后端NodeLoginVO保持一致
const loginForm = ref({
  code: '', // 和后端VO的code字段严格对应
  password: '' // 登录密码
})
// 表单校验规则：prop同步为code
const loginRules = ref({
  code: [
    { required: true, message: '请输入登录编码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' }
  ]
})

/**
 * 登录按钮点击事件
 * 1.执行表单校验
 * 2.请求后端登录接口 /node/login（request.js自动拼接为 http://127.0.0.1:8082/api/node/login）
 * 3.打印提交的JSON与后端返回结果，用于调试
 * 4.校验code=200，将token、nodeId、nodeName、nodeType存入Pinia
 * 5.跳转节点首页 /node/home
 */
const handleLogin = async () => {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loginLoading.value = true
    try {
      // 打印前端实际提交给后端的JSON数据，调试用
      console.log('前端提交请求体：', loginForm.value)
      // 关键：地址写 /node/login，request.js会自动匹配并拼接完整后端地址
      // 不要写 /api/node/login，否则匹配不到SERVER_MAP.node，会请求前端5173端口导致404
      const res = await request.post('/node/login', loginForm.value)
      console.log('【登录页拿到的返回】', res)
      // 手动判断业务码
      if (res.code === 200) {
        const nodeStore = useNodeUserStore()
        nodeStore.setUserInfo(res.data)
        ElMessage.success('登录成功')
        router.push('/node/home')
      } else {
        // 账号密码错误 / 登录失败，仅提示，页面不跳转
        ElMessage.error(res.msg || '登录失败，请核对账号密码')
      }
    } catch (error) {
      console.error('【登录接口请求异常】', error)
      ElMessage.error(error.msg || '请求异常')
    } finally {
      loginLoading.value = false
    }
  })
}

/**
 * 跳转到企业注册页面
 */
const goRegister = () => {
  router.push('/node/register')
}
</script>

<style scoped>
/* 全屏页面容器，兼容移动端vh，增加安全边距 */
.login-page {
  width: 100vw;
  min-height: 100vh;
  /* 背景图路径规则：图片放在 public/images/login-bg.png */
  background: url('/images/login-bg.png') no-repeat center center;
  background-size: cover;
  /* 图片加载失败降级蓝色渐变背景，防止空白 */
  background-color: #0052D4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  box-sizing: border-box;
}
/* 登录外层容器，自适应宽度，最大宽度限制 */
.login-wrap {
  width: 100%;
  max-width: 420px;
}
/* 顶部标题区域样式 */
.title-area {
  text-align: center;
  color: #ffffff;
  margin-bottom: 40px;
}
.system-title {
  font-size: clamp(28px, 6vw, 40px);
  font-weight: bold;
  margin: 280px 0 12px;
}
.sub-title-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: clamp(16px,4vw,20px);
}
.line {
  flex: 1;
  height: 2px;
  background-color: #fff;
}
.sub-text {
  white-space: nowrap;
}
/* 登录卡片改为半透明白色，不再完全遮挡背景图片 */
.login-card {
  /* rgba：最后一位0.82代表透明度，越小越透明（0~1） */
  background-color: rgba(255, 255, 255, 0.82);
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 4px 20px rgba(0, 82, 212, 0.15);
}
/* 修改表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 8px;
}
/* 自定义输入框：输入文字高度、字体强制16px，覆盖原有冲突样式 */
:deep(.custom-input .el-input__inner) {
  height: 36px !important;
  font-size: 16px !important;
}
/* 修改placeholder占位文字大小为16px */
:deep(.custom-input .el-input__inner::placeholder) {
  font-size: 16px;
  color: #999;
}
/* 登录按钮样式，移动端自适应高度 */
.login-btn {
  width: 100%;
  height: 36px;
  font-size: 20px;
  border: none;
  background: linear-gradient(90deg, #87d4f8, #007bdd);
}
/* 注册提示文字样式 */
.register-tip {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #666;
}
/* 手机端更小屏幕适配 */
@media screen and (max-width: 375px) {
  .login-card {
    padding: 24px 16px;
  }
}
</style>
