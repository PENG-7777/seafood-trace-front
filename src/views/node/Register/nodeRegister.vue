<template>
  <div class="node-register-container">
    <div class="register-wrap">
      <!-- 标题区域，和登录页保持统一风格 -->
      <div class="title-area">
        <h1 class="system-title">冷冻海产品溯源系统</h1>
        <div class="sub-title-line">
          <span class="line"></span>
          <span class="sub-text">流通结点端‑企业注册</span>
          <span class="line"></span>
        </div>
      </div>
      <el-card class="register-card">
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="130px"
          label-position="left"
        >
          <!-- 账号密码 -->
          <el-form-item label="登录编码" prop="code">
            <el-input v-model="registerForm.code" placeholder="请输入企业登录编码" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入登陆密码" show-password />
          </el-form-item>
          <!-- 企业基础信息 -->
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="registerForm.name" placeholder="请输入企业全称" />
          </el-form-item>
          <el-form-item label="企业类型" prop="type">
            <el-select v-model="registerForm.type" placeholder="请选择企业类型" style="width:100%" @change="handleTypeChange">
              <el-option v-for="item in dictStore.typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 省市区 字典联动 -->
          <el-form-item label="所属省份" prop="provId">
            <el-select v-model="registerForm.provId" placeholder="请选择省份" style="width:100%" @change="onProvinceChange">
              <el-option v-for="p in dictStore.provinceList" :key="p.value" :label="p.label" :value="p.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属城市" prop="cityId">
            <el-select v-model="registerForm.cityId" placeholder="请选择城市" style="width:100%">
              <el-option v-for="c in dictStore.cityList" :key="c.value" :label="c.label" :value="c.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="registerForm.address" placeholder="请输入详细地址" />
          </el-form-item>
          <!-- 证件信息 -->
          <el-form-item label="营业执照编号" prop="businessId">
            <el-input v-model="registerForm.businessId" placeholder="请输入营业执照编号" />
          </el-form-item>

          <!-- 动态许可证字段：根据企业类型动态显示 -->
          <el-form-item label="渔业捕捞许可证" prop="fishingLic" v-if="registerForm.type === 1">
            <el-input v-model="registerForm.fishingLic" placeholder="捕捞企业必填" />
          </el-form-item>
          <el-form-item label="水域滩涂养殖证" prop="aquacultureLic" v-if="registerForm.type === 2">
            <el-input v-model="registerForm.aquacultureLic" placeholder="养殖企业必填" />
          </el-form-item>
          <el-form-item label="食品经营许可证" prop="foodBusinessLic" v-if="[3,4,5].includes(registerForm.type)">
            <el-input v-model="registerForm.foodBusinessLic" placeholder="加工/批发/零售企业必填" />
          </el-form-item>

          <el-form-item label="法定代表人" prop="corporation">
            <el-input v-model="registerForm.corporation" placeholder="请输入法人姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="registerForm.telephone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="registerForm.remarks" type="textarea" rows="3" placeholder="选填备注信息" />
          </el-form-item>
          <el-form-item>
            <div class="btn-group">
              <el-button type="primary" class="submit-btn" :loading="submitLoading" @click="handleSubmit">注册</el-button>
              <el-button class="back-btn" @click="goLogin">返回</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { nodeRegister } from '@/api/node/login'
import { useDictStore } from '@/store/dict'
const router = useRouter()
const dictStore = useDictStore()

// 表单ref
const registerFormRef = ref(null)
// 提交加载状态
const submitLoading = ref(false)
// 标记：城市列表是否正在加载（防止切换省份还没拿到城市就提交）
const isCityLoading = ref(false)

/**
 * 注册表单对象，字段和后端NodeInfo实体一一对应
 */
const registerForm = reactive({
  code: '',
  password: '',
  name: '',
  type: null,
  provId: null,
  cityId: null,
  address: '',
  businessId: '',
  fishingLic: '',
  aquacultureLic: '',
  foodBusinessLic: '',
  corporation: '',
  telephone: '',
  remarks: ''
})

/**
 * 基础表单校验规则
 * trigger同时开启change+blur，避免切换下拉后校验不触发
 */
const baseRules = {
  code: [{ required: true, message: '请输入登录编码', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请设置登录密码', trigger: ['blur', 'change'] }],
  name: [{ required: true, message: '请输入企业名称', trigger: ['blur', 'change'] }],
  type: [{ required: true, message: '请选择企业类型', trigger: ['blur', 'change'] }],
  provId: [{ required: true, message: '请选择省份', trigger: ['blur', 'change'] }],
  cityId: [{ required: true, message: '请选择城市', trigger: ['blur', 'change'] }],
  address: [{ required: true, message: '请填写详细地址', trigger: ['blur', 'change'] }],
  businessId: [{ required: true, message: '请输入营业执照编号', trigger: ['blur', 'change'] }],
  corporation: [{ required: true, message: '请填写法人姓名', trigger: ['blur', 'change'] }],
  telephone: [{ required: true, message: '请填写联系电话', trigger: ['blur', 'change'] }]
}

// 响应式表单校验规则
const registerRules = reactive({ ...baseRules })

/**
 * 根据企业类型动态更新校验规则
 * 不同企业类型，许可证字段必填条件不一样
 */
const refreshRules = () => {
  // 重置为基础规则
  Object.assign(registerRules, baseRules)
  const type = registerForm.type
  if (type === 1) {
    // 捕捞企业：捕捞许可证必填
    registerRules.fishingLic = [{ required: true, message: '渔业捕捞许可证不能为空', trigger: ['blur', 'change'] }]
    delete registerRules.aquacultureLic
    delete registerRules.foodBusinessLic
  } else if (type === 2) {
    // 养殖企业：养殖证必填
    registerRules.aquacultureLic = [{ required: true, message: '水域滩涂养殖证不能为空', trigger: ['blur', 'change'] }]
    delete registerRules.fishingLic
    delete registerRules.foodBusinessLic
  } else if ([3, 4, 5].includes(type)) {
    // 加工/批发/零售：食品经营许可证必填
    registerRules.foodBusinessLic = [{ required: true, message: '食品经营许可证不能为空', trigger: ['blur', 'change'] }]
    delete registerRules.fishingLic
    delete registerRules.aquacultureLic
  } else {
    // 未选择企业类型，所有证书不做必填校验
    delete registerRules.fishingLic
    delete registerRules.aquacultureLic
    delete registerRules.foodBusinessLic
  }
  // 清除旧的校验提示
  registerFormRef.value?.clearValidate()
}

/**
 * 切换企业类型事件
 * 清空对应证书输入框，刷新校验规则
 */
const handleTypeChange = () => {
  registerForm.fishingLic = ''
  registerForm.aquacultureLic = ''
  registerForm.foodBusinessLic = ''
  refreshRules()
}

/**
 * 省份下拉切换事件
 * 1. 清空已选城市
 * 2. 异步加载该省份对应的城市列表
 * 3. 标记加载状态，防止请求没回来就提交
 */
const onProvinceChange = async (provId) => {
  // 清空旧的城市选择
  registerForm.cityId = null
  // 标记城市正在加载
  isCityLoading.value = true
  try {
    await dictStore.loadCityList(provId)
  } finally {
    // 请求结束，取消加载标记
    isCityLoading.value = false
  }
  // 清除城市字段校验提示
  registerFormRef.value?.clearValidate(['cityId'])
}

/**
 * 提交注册主方法
 * 1. 执行表单校验
 * 2. 增加额外业务校验：城市是否正在加载、cityId是否有效
 * 3. 数据类型转换，空字符串转null
 * 4. 调用注册接口
 */
const handleSubmit = async () => {
  if (!registerFormRef.value) return
  try {
    // 执行Element表单校验
    await registerFormRef.value.validate()
    // ==========【重点】额外业务校验，防止异步加载未完成导致非法cityId==========
    // 如果城市列表还在加载，禁止提交
    if (isCityLoading.value) {
      ElMessage.warning("城市列表正在加载，请稍候再提交")
      return
    }
    // 判断cityId是否为空
    if (registerForm.cityId === null || registerForm.cityId === undefined) {
      ElMessage.warning("请选择所属城市！")
      return
    }
    // 判断当前城市列表是否为空（代表省份没加载成功）
    if (dictStore.cityList.length === 0) {
      ElMessage.warning("该省份暂无可用城市数据，请检查省份选择")
      return
    }
    submitLoading.value = true
    // 拷贝表单数据，避免修改原始响应式对象
    const submitData = JSON.parse(JSON.stringify(registerForm))
    // 转换数字类型
    submitData.type = submitData.type ? Number(submitData.type) : null
    submitData.provId = submitData.provId ? Number(submitData.provId) : null
    submitData.cityId = submitData.cityId ? Number(submitData.cityId) : null
    // 空字符串转为null，适配数据库允许null的字段
    const nullableList = ['fishingLic', 'aquacultureLic', 'foodBusinessLic', 'address', 'remarks']
    nullableList.forEach(field => {
      if (submitData[field] === '') submitData[field] = null
    })
    // 调用注册接口
    const res = await nodeRegister(submitData)
    console.log("提交参数", submitData)
    if (res.code === 200) {
      ElMessage.success('注册成功！账号待管理员审核，请等待审核通过后登录')
      router.push('/node/login')
    } else {
      ElMessage.error(res.msg || '注册失败')
    }
  } catch (error) {
    // validate校验失败会进入catch，element自带提示，不需要重复弹框
    if (error !== false) {
      console.error('注册异常', error)
      ElMessage.error(error?.msg || '网络异常，注册失败')
    }
  } finally {
    submitLoading.value = false
  }
}

/**
 * 返回登录页面
 */
const goLogin = () => {
  router.push('/node/login')
}

/**
 * 页面挂载完成初始化
 * 加载全部字典数据（省份、企业类型）
 */
onMounted(async () => {
  await dictStore.initDict()
  refreshRules()
})
</script>

<style scoped>
/* 和登录页完全一致的全屏背景布局 */
.node-register-container {
  width: 100vw;
  min-height: 100vh;
  background: url('/images/login-bg.png') no-repeat center center;
  background-size: cover;
  background-color: #0052D4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  box-sizing: border-box;
}

.register-wrap {
  width: 100%;
  max-width: 750px;
}

/* 标题区域，与登录页样式统一 */
.title-area {
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
}

.system-title {
  font-size: clamp(28px, 6vw, 40px);
  font-weight: bold;
  margin: 0 0 12px;
}

.sub-title-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: clamp(16px, 4vw, 20px);
}

.line {
  flex: 1;
  height: 2px;
  background-color: #fff;
}

.sub-text {
  white-space: nowrap;
}

/* 卡片半透明，和登录卡片保持一致 */
.register-card {
  background-color: rgba(255, 255, 255, 0.82);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 82, 212, 0.15);
}

/* el‑card最外层容器，padding设置2px */
:deep(.el-card.register-card) {
  padding: 2px !important;
}

/* 重点：card内部body区域padding=6px */
:deep(.el-card__body) {
  padding: 6px !important;
}

/* 表单间距对齐原型 */
:deep(.el-form-item) {
  margin-bottom: 6px;
}

/* 按钮组样式：两个按钮水平并排，平分宽度，和原型一致 */
.btn-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 6px;
  justify-content: left;
}

/* 提交按钮 */
.submit-btn {
  flex: 1;
  height: 36px;
  font-size: 18px;
  border: none;
  background: linear-gradient(90deg, #87d4f8, #007bdd);
}

.back-btn {
  flex: 1;
  height: 36px;
  font-size: 18px;
}

/* 移动端适配 */
@media screen and (max-width: 375px) {
  :deep(.el-form-item__label) {
    font-size: 16px;
  }
}
</style>
