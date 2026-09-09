<template>
  <div class="confirm-page">
    <!-- 顶部返回标题栏 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">下游企业进场申请确认</div>
    </div>
    <!-- 业务Banner -->
    <div class="banner-block">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>
    <!-- 列表容器 -->
    <div class="list-wrap">
      <!-- 空数据提示：申请列表为空时展示 -->
      <div class="empty-tip" v-if="applyList.length === 0">
        暂无待确认的进场申请
      </div>
      <!-- 申请卡片：遍历下游加工进场申请列表 -->
      <div class="apply-card" v-for="item in applyList" :key="item.pbId">
        <div class="card-row">
          <span class="label">养殖批号：</span>
          <span>{{ item.batchId || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">加工申请批号：</span>
          <span>{{ item.processNo || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">下游加工企业：</span>
          <span>{{ item.nodeName || '未知企业' }}</span>
        </div>
        <div class="card-row">
          <span class="label">申请进场时间：</span>
          <span>{{ item.processDate || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">申请状态：</span>
          <span
            class="state-tag"
            :class="{
              wait: item.state === 1,
              ok: item.state === 2
            }"
          >
            {{ getStateText(item.state) }}
          </span>
        </div>
        <!-- 操作按钮区域：仅【待确认】状态展示确认按钮 -->
        <div class="btn-group" v-if="item.state === 1">
          <button class="btn-confirm" @click="handleConfirm(item.pbId)">确认进场</button>
        </div>
        <!-- 已确认完成提示文案 -->
        <div class="done-tip" v-if="item.state === 2">
          ✅ 已确认进场
        </div>
      </div>
    </div>
    <!-- 底部导航栏（和首页逻辑统一 + 激活高亮） -->
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
// 接口名称与farmSeaBatch.js导出严格匹配
import { confirmFarmProcessBatch, getFarmProcessApplyList } from '@/api/node/farmSeaBatch'
// 路由实例
const router = useRouter()
// 当前路由对象，用于tab高亮判断
const route = useRoute()
// 获取登录节点用户仓库
const nodeStore = useNodeUserStore()
// 响应式获取企业类型
const { nodeType } = storeToRefs(nodeStore)
/**
 * applyList：保存当前养殖企业收到的下游加工进场申请列表
 */
const applyList = ref([])
/**
 * 获取申请状态中文文案映射
 * @param {Number} state 1=待确认，2=已确认
 * @returns {String} 状态中文描述
 */
const getStateText = (state) => {
  const map = {
    1: '待养殖企业确认',
    2: '已确认进场'
  }
  return map[state]
}
/**
 * 加载当前养殖企业收到的所有下游进场申请
 * try‑catch捕获网络异常，页面容错不会白屏崩溃
 */
const loadApplyList = async () => {
  try {
    const res = await getFarmProcessApplyList()
    console.log('下游进场申请返回：', res)
    if (res.code === 200) {
      applyList.value = res.data
    }
  } catch (err) {
    console.error('加载养殖进场申请失败：', err)
    applyList.value = []
  }
}
/**
 * 确认下游加工企业进场申请
 * @param {Number} pbId 加工批号主键ID（后端接口接收该参数）
 */
const handleConfirm = async (pbId) => {
  ElMessageBox.confirm(
    '确认批准该下游企业进场加工？确认后流程不可撤回',
    '业务确认提示',
    {
      confirmButtonText: '确认批准',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    try {
      const res = await confirmFarmProcessBatch(pbId)
      if (res.code === 200) {
        ElMessage.success('进场申请确认成功！')
        // 确认完成刷新申请列表，更新状态
        loadApplyList()
      } else {
        ElMessage.error(res.msg || '确认失败')
      }
    } catch (err) {
      console.error('确认进场失败', err)
      ElMessage.error('网络异常，确认失败')
    }
  }).catch(() => {})
}
/**
 * 根据当前登录企业类型，跳转到对应批号管理页面
 * nodeType枚举：1捕捞｜2养殖｜3加工｜4批发｜5零售
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
      router.push('/node/farmSeaBatch/list')
  }
}
/**
 * 判断当前页面是否为批号管理页面，用于底部tab高亮激活
 */
const isBatchPage = computed(() => {
  return route.path.includes('/list')
})
/**
 * 页面挂载生命周期钩子，进入页面自动加载进场申请数据
 */
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
  height: 150px;
  background: #48bc70 url('@/assets/banner-food.png') no-repeat right center;
  background-size: contain;
  padding: 20px 20px;
}
.banner-text h1 {
  font-size: 36px;
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
}
.banner-text p {
  background: rgba(0,80,40,0.4);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  display: inline-block;
}
.list-wrap {
  padding: 20px 20px;
  flex: 1;
}
.empty-tip {
  text-align: center;
  font-size: 28px;
  color: #999;
  padding: 60px 0;
}
.apply-card {
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
}
.card-row {
  font-size: 14px;
  line-height: 20px;
}
.label {
  color: #666;
}
.state-tag {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
}
.wait {
  background: #fff3cd;
  color: #d39e00;
}
.ok {
  background: #d1e7dd;
  color: #198754;
}
.btn-group {
  margin-top: 20px;
}
.btn-confirm {
  width: 100%;
  height: 48px;
  background-color: #39b568;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
}
.done-tip {
  margin-top:20px;
  font-size:16px;
  color:#198754;
  text-align:center;
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
