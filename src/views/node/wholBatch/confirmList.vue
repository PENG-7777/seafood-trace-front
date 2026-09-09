<!-- src/views/node/wholBatch/confirmList.vue -->
<!-- 流通节点端：批发商确认下游零售商进场申请页面 -->
<!-- UI布局、样式、底部导航逻辑完全对齐 processBatch/confirmList.vue -->
<!-- 业务状态说明：reta_batch真实状态 1新建,2待确认,3已确认,4已下架 -->
<template>
  <div class="confirm-page">
    <!-- 顶部返回标题栏 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">下游零售企业进场申请确认</div>
    </div>
    <!-- 业务宣传Banner -->
    <div class="banner-block">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>
    <!-- 申请列表容器 -->
    <div class="list-wrap">
      <!-- 空数据提示：没有待确认的申请记录 -->
      <div class="empty-tip" v-if="applyList.length === 0">
        暂无待确认的进场申请
      </div>
      <!-- 进场申请卡片循环渲染 -->
      <div class="apply-card" v-for="item in applyList" :key="item.retaBatchId">
        <div class="card-row">
          <span class="label">零售申请批号：</span>
          <span>{{ item.retaBatchId }}</span>
        </div>
        <div class="card-row">
          <span class="label">上游批发批号：</span>
          <span>{{ item.wholBatchId }}</span>
        </div>
        <div class="card-row">
          <span class="label">下游零售企业：</span>
          <span>{{ item.retaNodeName }}</span>
        </div>
        <div class="card-row">
          <span class="label">申请进场时间：</span>
          <span>{{ item.applyTime || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">申请状态：</span>
          <span
            class="state-tag"
            :class="{
              new: item.applyState === 1,
              wait: item.applyState === 2,
              ok: item.applyState === 3,
              down: item.applyState === 4
            }"
          >
            {{ getStateText(item.applyState) }}
          </span>
        </div>
        <!-- 操作按钮区域：仅【2待确认】状态显示确认按钮 -->
        <div class="btn-group" v-if="item.applyState === 2">
          <button class="btn-confirm" @click="handleConfirm(item.retaBatchId)">确认进场</button>
        </div>
        <!-- 已确认状态展示完成提示文案 -->
        <div class="done-tip" v-if="item.applyState === 3">
          ✅ 已确认进场
        </div>
        <!-- 已下架状态提示 -->
        <div class="done-tip down-tip" v-if="item.applyState === 4">
          🚫 该批号已下架
        </div>
      </div>
    </div>
    <!-- 底部Tab导航栏，路由激活高亮逻辑统一 -->
    <div class="tab-bar">
      <div class="tab-item" :class="{active: route.path === '/node/home'}" @click="$router.push('/node/home')">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <div class="tab-item" :class="{active: isBatchPage}" @click="goBatchManagePage">
        <div class="icon-my"></div>
        <span>我的</span>
      </div>
      <div class="tab-item" :class="{active: route.path === '/node/password'}" @click="$router.push('/node/password')">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useNodeUserStore } from '@/store/nodeUser'
import { storeToRefs } from 'pinia'
// 导入批发商确认零售商申请接口方法
import { confirmRetaBatch, getRetaApplyList } from '@/api/node/wholBatch'

const router = useRouter()
const route = useRoute()
const nodeStore = useNodeUserStore()
const { nodeType } = storeToRefs(nodeStore)

// 下游零售商进场申请列表原始数据
const applyList = ref([])

/**
 * 获取申请状态中文文案映射
 * reta_batch真实状态：1新建,2待确认,3已确认,4已下架
 * @param {Number} applyState 状态码
 */
const getStateText = (applyState) => {
  const map = {
    1: '新建',
    2: '待批发企业确认',
    3: '已确认进场',
    4: '已下架'
  }
  return map[applyState] || '未知状态'
}

/**
 * 加载当前批发商收到的全部下游零售进场申请数据
 */
const loadApplyList = async () => {
  try {
    const res = await getRetaApplyList()
    if (res.code === 200) {
      applyList.value = res.data
      console.log('零售商进场申请列表：', applyList.value)
    }
  } catch (err) {
    console.error('加载进场申请失败：', err)
    applyList.value = []
  }
}

/**
 * 确认批准零售商进场申请，后端自动生成溯源二维码
 * @param {Number} retaBatchId 零售商批号主键ID
 */
const handleConfirm = async (retaBatchId) => {
  console.log('【确认零售商进场】retaBatchId = ', retaBatchId)
  ElMessageBox.confirm(
    '确认批准该下游零售企业进场流通？确认后流程不可撤回，系统自动生成产品溯源码',
    '业务确认提示',
    {
      confirmButtonText: '确认批准',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    try {
      const res = await confirmRetaBatch(retaBatchId)
      console.log('确认接口返回：', res)
      if (res.code === 200) {
        ElMessage.success('进场申请确认成功！溯源码已生成')
        loadApplyList()
      } else {
        ElMessage.error(res.msg || '确认失败')
      }
    } catch (err) {
      console.error('确认进场失败', err)
      ElMessage.error('操作失败，请重试')
    }
  }).catch(() => {})
}

/**
 * 根据当前登录企业类型，跳转至对应批号管理页面
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
      router.push('/node/wholBatch/list')
  }
}

/**
 * 计算属性：判断当前页面是否属于批号管理页面，用于tab高亮
 */
const isBatchPage = computed(() => {
  return route.path.includes('/list')
})

// 页面挂载完成，自动加载进场申请列表
onMounted(() => {
  loadApplyList()
})
</script>

<style scoped>
.confirm-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
.page-header {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 22px;
  position: relative;
}
.back-icon {
  position: absolute;
  left: 16px;
  top:18px;
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
  font-weight: bold;
}
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
.list-wrap {
  padding: 30px 24px;
  flex: 1;
}
.empty-tip {
  text-align: center;
  font-size: 16px;
  color: #999;
  padding: 60px 0;
}
.apply-card {
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 20px;
}
.card-row {
  font-size: 16px;
  line-height: 28px;
}
.label {
  color: #666;
}
.state-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
/* 1新建 */
.new {
  background: #e2e3e5;
  color: #6c757d;
}
/* 2待确认 */
.wait {
  background: #fff3cd;
  color: #d39e00;
}
/* 3已确认 */
.ok {
  background: #d1e7dd;
  color: #198754;
}
/* 4已下架 */
.down {
  background: #f8d7da;
  color: #dc3545;
}
.btn-group {
  margin-top: 20px;
}
.btn-confirm {
  width: 100%;
  height: 40px;
  background-color: #39b568;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
}
.done-tip {
  margin-top:8px;
  font-size:16px;
  color:#198754;
  text-align:right;
}
.down-tip {
  color: #dc3545;
}
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: 60px;
  align-items: center;
  border-top:1px solid #eee;
  flex-shrink: 0;
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
  color: #0052D4;
}
.icon-home,
.icon-my,
.icon-pwd {
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.icon-home {
  background-image: url('/images/home.png');
}
.icon-my {
  background-image: url('/images/my.png');
}
.icon-pwd {
  background-image: url('/images/change.png');
}
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
