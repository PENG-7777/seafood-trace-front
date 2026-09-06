<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">冷冻海产品溯源平台</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const loginFormRef = ref(null)
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = reactive({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    const flag = await userStore.loginAction(loginForm)
    if (flag) {
      ElMessage.success('登录成功')
      router.push('/node/manage')
      loginForm.username = ''
      loginForm.password = ''
    } else {
      ElMessage.error('账号或密码错误')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 420px;
  padding: 40px 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.title {
  text-align: center;
  margin-bottom: 36px;
  font-size: 22px;
  color: #1f2937;
  font-weight: 600;
}
:deep(.el-form-item) {
  margin-bottom: 22px;
}
:deep(.el-input__inner) {
  height: 42px;
}
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}
</style>
