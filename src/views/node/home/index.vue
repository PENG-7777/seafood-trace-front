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
    <!-- Banner头部宣传区域 -->
    <div class="banner">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>
    <!-- 当前登录企业信息展示区，修改字段与Pinia对齐 -->
    <div class="company-info">
      <h2>{{ nodeName }}</h2>
      <p>当前溯源节点类型：{{ nodeType }}</p>
    </div>
    <!-- 功能按钮列表区域 -->
    <div class="btn-list">
      <!-- 新建产品批号：根据企业类型跳转到各自独立的新增页面 -->
      <div class="func-btn green" @click="goCreateBatchPage">
        <span>{{ createBtnText }}</span>
      </div>
      <!-- 产品批号管理：不同企业跳转各自批号管理列表页 -->
      <div class="func-btn purple" @click="goBatchManagePage">
        <span>产品批号管理</span>
      </div>
      <!-- 动态按钮：捕捞/养殖/冷冻加工/批发企业展示；零售商隐藏【下游企业进场确认】 -->
      <div v-if="showConfirmBtn" class="func-btn blue" @click="$router.push('/node/audit')">
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
      <!-- 我的页面tab，跳转个人中心 -->
      <div class="tab-item" @click="$router.push('/node/mine')">
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
// 从Pinia中取出响应式变量
const { nodeName, nodeType } = storeToRefs(nodeStore)

/**
 * 配置拥有【下游企业进场确认】按钮的企业白名单
 * 捕捞企业、养殖企业、冷冻加工企业、批发企业显示该按钮，零售商不显示
 */
const confirmWhiteList = ['捕捞企业', '养殖企业', '冷冻加工企业', '批发企业']
// 判断布尔值：当前企业是否在白名单内
const showConfirmBtn = computed(() => {
  return confirmWhiteList.includes(nodeType.value)
})

/**
 * 动态修改新建批号按钮文字，区分不同业务节点
 */
const createBtnText = computed(() => {
  const type = nodeType.value
  switch (type) {
    case '捕捞企业':
      return '新建捕捞批号'
    case '养殖企业':
      return '新建养殖批号'
    case '冷冻加工企业':
      return '新建加工批号'
    case '批发企业':
      return '新建批发批号'
    case '零售商':
      return '新建零售批号'
    default:
      return '新建产品批号'
  }
})

/**
 * 根据企业类型跳转对应独立的【新建产品批号】页面
 */
const goCreateBatchPage = () => {
  const type = nodeType.value
  switch (type) {
    case '捕捞企业':
      router.push('/node/fishBatch/add')
      break
    case '养殖企业':
      router.push('/node/breedBatch/add')
      break
    case '冷冻加工企业':
      router.push('/node/processBatch/add')
      break
    case '批发企业':
      router.push('/node/wholBatch/add')
      break
    case '零售商':
      router.push('/node/retailBatch/add')
      break
    default:
      router.push('/node/fishBatch/add')
  }
}

/**
 * 根据企业类型跳转对应独立的【产品批号管理列表】页面
 */
const goBatchManagePage = () => {
  const type = nodeType.value
  switch (type) {
    case '捕捞企业':
      router.push('/node/fishBatch/list')
      break
    case '养殖企业':
      router.push('/node/breedBatch/list')
      break
    case '冷冻加工企业':
      router.push('/node/processBatch/list')
      break
    case '批发企业':
      router.push('/node/wholBatch/list')
      break
    case '零售商':
      router.push('/node/retailBatch/list')
      break
    default:
      router.push('/node/fishBatch/list')
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
  width: clamp(20px, 6vw, 20px);
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
/* Banner头部区域，使用clamp动态适配不同手机屏幕高度 */
.banner {
  min-height: 120px;
  height: clamp(140px, 20vh, 150px);
  background: #48bc70 url('@/assets/banner-food.png') no-repeat right center;
  background-size: contain;
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
  padding: 24px 10px;
}
.company-info h2 {
  font-size: clamp(22px, 7vw, 36px);
  color: #008844;
  margin-bottom: 8px;
}
.company-info p {
  font-size: clamp(18px, 5vw, 28px);
  color: #666;
}
/* 功能按钮容器，左右留白，垂直排列按钮 */
.btn-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}
/* 功能按钮通用样式，高度自适应，圆角美观 */
.func-btn {
  min-height: 100px;
  height: clamp(100px, 20vh, 100px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 32px;
  font-size: clamp(22px, 6vw, 40px);
  color: #fff;
  box-sizing: border-box;
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
