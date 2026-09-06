<template>
  <div class="confirm-page">
    <!-- 顶部返回标题栏 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()">&lt;</div>
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
      <!-- 空数据提示 -->
      <div class="empty-tip" v-if="applyList.length === 0">
        暂无待确认的进场申请
      </div>

      <!-- 申请卡片 -->
      <div class="apply-card" v-for="item in applyList" :key="item.processBatchId">
        <div class="card-row">
          <span class="label">加工申请批号：</span>
          <span>{{ item.processBatchId }}</span>
        </div>
        <div class="card-row">
          <span class="label">上游捕捞批号：</span>
          <span>{{ item.fishBatchId }}</span>
        </div>
        <div class="card-row">
          <span class="label">下游加工企业：</span>
          <span>{{ item.processNodeName }}</span>
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
              wait: item.applyState === 1,
              ok: item.applyState === 2
            }"
          >
            {{ getStateText(item.applyState) }}
          </span>
        </div>

        <!-- 操作按钮区域 -->
        <div class="btn-group" v-if="item.applyState === 1">
          <button class="btn-confirm" @click="handleConfirm(item.processBatchId)">确认进场</button>
        </div>
        <div class="done-tip" v-if="item.applyState === 2">
          ✅ 已确认进场
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <div class="tab-item" @click="$router.push('/node/home')">首页</div>
      <div class="tab-item" @click="$router.push('/node/mine')">我的</div>
      <div class="tab-item" @click="$router.push('/node/password')">更新密码</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入接口文件（你已有的api）
import { confirmProcessBatch, getProcessApplyList } from '@/api/node/fishBatch'

// 进场申请列表数据
const applyList = ref([])

/**
 * 获取申请状态中文文案
 * @param {Number} applyState 1待确认，2已确认
 */
const getStateText = (applyState) => {
  const map = {
    1: '待捕捞企业确认',
    2: '已确认进场'
  }
  return map[applyState]
}

/**
 * 加载当前捕捞企业收到的所有下游进场申请
 */
const loadApplyList = async () => {
  const res = await getProcessApplyList()
  if (res.code === 200) {
    applyList.value = res.data
  }
}

/**
 * 确认下游加工企业进场申请
 * @param {Number} processBatchId 加工申请主键
 */
const handleConfirm = async (processBatchId) => {
  ElMessageBox.confirm(
    '确认批准该下游企业进场加工？确认后流程不可撤回',
    '业务确认提示',
    {
      confirmButtonText: '确认批准',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    // 调用你预先定义好的确认接口
    const res = await confirmProcessBatch(processBatchId)
    if (res.code === 200) {
      ElMessage.success('进场申请确认成功！')
      // 确认完成刷新列表
      loadApplyList()
    }
  }).catch(() => {})
}

// 页面挂载自动加载申请列表
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
.list-wrap {
  padding: 30px 24px;
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
  padding: 24px;
  margin-bottom: 20px;
}
.card-row {
  font-size: 28px;
  line-height: 50px;
}
.label {
  color: #666;
}
.state-tag {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 24px;
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
  height: 72px;
  background-color: #39b568;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 30px;
}
.done-tip {
  margin-top:20px;
  font-size:28px;
  color:#198754;
  text-align:center;
}
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: 120px;
  align-items: center;
  border-top:1px solid #eee;
  font-size:24px;
  color:#999;
}
</style>
