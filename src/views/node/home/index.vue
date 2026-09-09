<template>
  <!-- 首页根容器，弹性布局实现底部导航吸底，移动端自适应 -->
  <div class="home-page">
    <!-- 顶部导航栏：返回箭头 + 居中首页标题 -->
    <div class="page-header">
      <!-- 返回按钮，点击跳转到流通节点登录页 -->
      <div class="back-icon" @click="$router.push('/node/login')"></div>
      <div class="header-title">首页</div>
      <!-- 占位空白div，保证标题严格居中 -->
      <div class="placeholder"></div>
    </div>
    <!-- Banner头部宣传区域，使用完整背景图 -->
    <div class="banner">
      <div class="banner-text">
      </div>
    </div>
    <!-- 当前登录企业信息展示区，修改字段与Pinia对齐 -->
    <div class="company-info">
      <h2>{{ nodeName }}</h2>
      <p>当前溯源节点类型：{{ nodeTypeName }}</p>
    </div>
    <!-- 功能按钮列表区域 -->
    <div class="btn-list">
      <!-- 新建产品批号：根据企业类型跳转到各自独立的新增页面 -->
      <div class="func-btn green" @click="goCreateBatchPage">
        <div class="btn-icon add-icon"></div>
        <span>{{ createBtnText }}</span>
      </div>
      <!-- 产品批号管理：不同企业跳转各自批号管理列表页 -->
      <div class="func-btn purple" @click="goBatchManagePage">
        <div class="btn-icon manage-icon"></div>
        <span>产品批号管理</span>
      </div>
      <!-- 动态按钮：捕捞/养殖/冷冻加工/批发企业展示；零售商隐藏【下游企业进场确认】 -->
      <div v-if="showConfirmBtn" class="func-btn blue" @click="goConfirmPage">
        <div class="btn-icon confirm-icon"></div>
        <span>下游企业进场确认</span>
      </div>
    </div>
    <!-- 底部Tab导航栏，固定吸底 -->
    <div class="tab-bar">
      <!-- 首页tab，激活状态，使用高亮图标 -->
      <div class="tab-item active">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <!-- 我的：跳转到批号管理 -->
      <div class="tab-item" @click="goBatchManagePage">
        <div class="icon-my"></div>
        <span>我的</span>
      </div>
      <!-- 修改密码tab，跳转密码更新页面 -->
      <div class="tab-item" @click="$router.push('/node/password')">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// 导入流通节点用户Pinia仓库，读取登录后的企业信息
import { useNodeUserStore } from '@/store/nodeUser'
// storeToRefs保证pinia变量响应式更新
import { storeToRefs } from 'pinia'
const router = useRouter()
const nodeStore = useNodeUserStore()
// 从Pinia取出数字类型 nodeType（1/2/3/4/5）
const { nodeName, nodeType } = storeToRefs(nodeStore)
// 数字 → 中文名称映射表
const typeMap = {
  1: '捕捞企业',
  2: '养殖企业',
  3: '冷冻加工企业',
  4: '批发企业',
  5: '零售商'
}
// 页面展示用的中文企业名称
const nodeTypeName = computed(() => {
  return typeMap[nodeType.value] || '未知企业'
})
/**
 * 配置拥有【下游企业进场确认】按钮的企业编号白名单
 * 1捕捞｜2养殖｜3冷冻加工｜4批发 → 显示按钮；5零售商隐藏
 */
const confirmWhiteCodeList = [1, 2, 3, 4]
const showConfirmBtn = computed(() => {
  return confirmWhiteCodeList.includes(Number(nodeType.value))
})
/**
 * 动态修改新建批号按钮文字
 */
const createBtnText = computed(() => {
  const code = Number(nodeType.value)
  switch (code) {
    case 1:
      return '新建捕捞批号'
    case 2:
      return '新建养殖批号'
    case 3:
      return '新建加工批号'
    case 4:
      return '新建批发批号'
    case 5:
      return '新建零售批号'
    default:
      return '新建产品批号'
  }
})
/**
 * 根据企业编码跳转对应独立的【新建产品批号】页面
 */
const goCreateBatchPage = () => {
  const code = Number(nodeType.value)
  switch (code) {
    case 1:
      router.push('/node/fishBatch/add')
      break
    case 2:
      router.push('/node/farmSeaBatch/add')
      break
    case 3:
      router.push('/node/processBatch/add')
      break
    case 4:
      router.push('/node/wholBatch/add')
      break
    case 5:
      router.push('/node/retaBatch/add')
      break
    default:
      router.push('/node/fishBatch/add')
  }
}
/**
 * 根据企业编码跳转对应独立的【产品批号管理列表】页面
 */
const goBatchManagePage = () => {
  const code = Number(nodeType.value)
  switch (code) {
    case 1:
      router.push('/node/fishBatch/list')
      break
    case 2:
      router.push('/node/farmSeaBatch/list')
      break
    case 3:
      router.push('/node/processBatch/list')
      break
    case 4:
      router.push('/node/wholBatch/list')
      break
    case 5:
      router.push('/node/retaBatch/list')
      break
    default:
      router.push('/node/fishBatch/list')
  }
}
/**
 * 下游企业进场确认页面：按企业类型跳转各自独立confirmList页面
 */
const goConfirmPage = () => {
  const code = Number(nodeType.value)
  switch (code) {
    case 1:
      router.push('/node/fishBatch/confirmList')
      break
    case 2:
      router.push('/node/farmSeaBatch/confirmList')
      break
    case 3:
      router.push('/node/processBatch/confirmList')
      break
    case 4:
      router.push('/node/wholBatch/confirmList')
      break
  }
}
</script>

<style scoped>
/* 页面根容器，最小高度铺满屏幕，弹性布局使底部导航自动吸底 */
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
/* 自定义顶部导航栏布局：左右分布，标题居中 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: clamp(44px, 10vh, 50px);
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}
/* 返回箭头图标样式 */
.back-icon {
  width: clamp(18px, 6vw, 18px);
  height: clamp(20px, 6vw, 20px);
  background: url('/images/back.png') no-repeat center;
  background-size: contain;
  cursor: pointer;
}
/* 顶部居中标题 */
.header-title {
  font-size: clamp(22px, 5vw, 24px);
  font-weight: bold;
  color: #333;
}
/* 右侧空白占位元素，保证标题绝对居中 */
.placeholder {
  width: clamp(24px, 6vw, 32px);
}
/* Banner头部区域，使用指定背景图 */
.banner {
  min-height: 120px;
  height: clamp(140px, 20vh, 150px);
  background: url('/images/banner.png') no-repeat center;
  background-size: cover;
  padding: 12px 16px;
  box-sizing: border-box;
}
.banner-text h1 {
  font-size: clamp(32px, 10vw, 60px);
  color: #fff;
  font-weight: bold;
  margin: 8px 0;
}
.banner-text p {
  background: rgba(0, 80, 40, 0.4);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  display: inline-block;
  font-size: clamp(14px, 4vw, 18px);
}
/* 企业信息居中展示，自适应字体大小 */
.company-info {
  text-align: center;
  padding: 14px 10px;
}
.company-info h2 {
  font-size: clamp(18px, 6vw, 22px);
  color: #008844;
  margin-bottom: 2px;
}
.company-info p {
  font-size: clamp(18px, 5vw, 22px);
  color: #666;
}
/* 功能按钮容器，左右留白，垂直排列按钮 */
.btn-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
/* 功能按钮通用样式：横向布局，左侧图标 + 文字 */
.func-btn {
  min-height: 80px;
  height: clamp(80px, 16vh, 80px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
  font-size: clamp(20px, 6vw, 20px);
  color: #fff;
  box-sizing: border-box;
}
/* 按钮左侧图标公共样式 */
.btn-icon {
  width: 120px;
  height: 80px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.add-icon {
  background-image: url('/images/add.png');
}
.manage-icon {
  background-image: url('/images/manage.png');
}
.confirm-icon {
  background-image: url('/images/confirm.png');
}
/* 绿色渐变按钮样式 */
.green {
  background: linear-gradient(90deg, #90dd90, #28a75c);
}
/* 紫色渐变按钮样式 */
.purple {
  background: linear-gradient(90deg, #b060d8, #7820a0);
}
/* 蓝色渐变按钮样式 */
.blue {
  background: linear-gradient(90deg, #30b0e8, #0040b8);
}
/* 底部导航栏，固定吸底，高度自适应手机 */
.tab-bar {
  margin-top: auto;
  display: flex;
  justify-content: space-around;
  height: clamp(50px, 15vh, 60px);
  align-items: center;
  border-top: 1px solid #eee;
  box-sizing: border-box;
}
/* 单个导航项：图标 + 文字垂直排列 */
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: clamp(10px, 4vw, 18px);
  color: #999;
  gap: 1px;
  cursor: pointer;
}
/* 导航激活文字颜色 */
.tab-item.active {
  color: #0052D4;
}
/* 底部导航图标基础尺寸 */
.icon-home,
.icon-my,
.icon-pwd {
  width: clamp(22px, 8vw, 22px);
  height: clamp(22px, 8vw, 22px);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
/* 默认状态图标 */
.icon-home {
  background-image: url('/images/home.png');
}
.icon-my {
  background-image: url('/images/my.png');
}
.icon-pwd {
  background-image: url('/images/change.png');
}
/* 选中激活状态图标覆盖 */
.tab-item.active .icon-home {
  background-image: url('/images/home-active.png');
}
.tab-item.active .icon-my {
  background-image: url('/images/my-active.png');
}
.tab-item.active .icon-pwd {
  background-image: url('/images/change-active.png');
}
</style>
