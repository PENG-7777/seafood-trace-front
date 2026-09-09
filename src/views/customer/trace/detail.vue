<template>
  <div class="trace-detail-container">
    <!-- 返回头部 -->
    <div class="detail-header">
      <el-icon class="back-icon" @click="$router.back()">
        <ArrowLeft />
      </el-icon>
      <span class="header-title">溯源详情</span>
    </div>

    <div v-if="loading" class="loading-box">
      <el-spinner size="40" />
      <p class="loading-text">正在加载溯源数据...</p>
    </div>

    <div v-else-if="traceData" class="detail-content">

      <!-- 全链路 -->
      <div class="timeline-wrap">
        <!-- 源头：捕捞 / 养殖企业 -->
        <div v-if="traceData.originBatch" class="process-item">
          <div class="item-header">
            <div class="avatar-box">
              <img src="/images/avater1.png" alt="源头节点头像" class="avatar-img" />
            </div>
            <div>
              <div class="item-type">
                {{ traceData.originBatch.fbId ? '捕捞企业' : '养殖企业' }}
              </div>
              <div class="item-company">{{ traceData.originBatch.nodeName || '源头节点' }}</div>
            </div>
          </div>

          <div class="info-list">
            <!-- 捕捞批次 -->
            <template v-if="traceData.originBatch.fbId">
              <div class="info-row">产品品种：{{ traceData.originBatch.type }}</div>
              <div class="info-row">产品批号：{{ traceData.originBatch.batchId }}</div>
              <div class="info-row">捕捞许可证编号：{{ traceData.originBatch.fishLicId }}</div>
              <div class="info-row">捕捞海域：{{ traceData.originBatch.seaArea }}</div>
              <div class="info-row">批号日期：{{ traceData.originBatch.batchDate }}</div>
            </template>

            <!-- 养殖批次 -->
            <template v-if="traceData.originBatch.fsbId">
              <div class="info-row">产品品种：{{ traceData.originBatch.type }}</div>
              <div class="info-row">产品批号：{{ traceData.originBatch.batchId }}</div>
              <div class="info-row">养殖证编号：{{ traceData.originBatch.aquaLicId }}</div>
              <div class="info-row">养殖基地地址：{{ traceData.originBatch.farmAddr }}</div>
              <div class="info-row">批号日期：{{ traceData.originBatch.batchDate }}</div>
            </template>
          </div>
        </div>

        <!-- 加工企业 -->
        <div v-if="traceData.processBatch" class="process-item">
          <div class="item-header">
            <div class="avatar-box">
              <img src="/images/avater2.png" alt="加工企业头像" class="avatar-img" />
            </div>
            <div>
              <div class="item-type">加工企业</div>
              <div class="item-company">{{ traceData.processBatch.nodeName || '加工节点' }}</div>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">产品品种：{{ traceData.processBatch.type }}</div>
            <div class="info-row">产品批号：{{ traceData.processBatch.batchId }}</div>
            <div class="info-row">加工编号：{{ traceData.processBatch.processNo }}</div>
            <div class="info-row">冷库信息：{{ traceData.processBatch.coldStorageInfo }}</div>
            <div class="info-row">批号日期：{{ traceData.processBatch.processDate }}</div>
            <div class="info-row">操作人：{{ traceData.processBatch.processPerson }}</div>
          </div>
        </div>

        <!-- 批发商 -->
        <div v-if="traceData.wholBatch" class="process-item">
          <div class="item-header">
            <div class="avatar-box">
              <img src="/images/avater3.png" alt="批发商头像" class="avatar-img" />
            </div>
            <div>
              <div class="item-type">批发商</div>
              <div class="item-company">{{ traceData.wholBatch.nodeName || '批发节点' }}</div>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">产品品种：{{ traceData.wholBatch.type }}</div>
            <div class="info-row">产品批号：{{ traceData.wholBatch.batchId }}</div>
            <div class="info-row">批号日期：{{ traceData.wholBatch.batchDate }}</div>
            <div class="info-row">检验人：{{ traceData.wholBatch.testName }}</div>
          </div>
        </div>

        <!-- 零售商 -->
        <div v-if="traceData.retaBatch" class="process-item">
          <div class="item-header">
            <div class="avatar-box">
              <img src="/images/avater4.png" alt="零售商头像" class="avatar-img" />
            </div>
            <div>
              <div class="item-type">零售商</div>
              <div class="item-company">{{ traceData.retaBatch.nodeName || '零售节点' }}</div>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">产品品种：{{ traceData.retaBatch.type }}</div>
            <div class="info-row">产品批号：{{ traceData.retaBatch.batchId }}</div>
            <div class="info-row">批号日期：{{ traceData.retaBatch.batchDate }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-box">
      <el-icon color="#c0c4cc" size="60"><DocumentRemove /></el-icon>
      <p class="empty-text">暂无溯源信息</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, DocumentRemove } from '@element-plus/icons-vue'
import { queryTraceInfo } from '@/api/publicTrace/trace'

const route = useRoute()
const router = useRouter()
const sourceId = ref('')
const loading = ref(true)
const traceData = ref(null)

const getTraceDetail = async () => {
  sourceId.value = route.query.sourceId
  console.log('详情页拿到的sourceId：', sourceId.value)

  if (!sourceId.value) {
    ElMessage.warning('溯源编号不能为空')
    router.push('/customer/trace')
    return
  }

  loading.value = true

  try {
    const res = await queryTraceInfo(sourceId.value)
    console.log('详情页接口返回：', res)

    if (res.code === 200) {
      traceData.value = res.data
    } else {
      ElMessage.error(res.msg || '查询溯源数据失败')
    }
  } catch (err) {
    ElMessage.error('接口请求异常，请检查后端服务')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTraceDetail()
})
</script>

<style scoped>
.trace-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 40px;
}

.detail-header {
  height: 52px;
  background-color: #409eff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #fff;
}

.back-icon {
  font-size: 22px;
  cursor: pointer;
  margin-right: 12px;
}

.header-title {
  font-size: 22px;
  font-weight: 500;
  margin: 100px;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
}

.loading-text {
  margin-top: 12px;
  color: #909399;
}

.base-card {
  margin: 8px  16px 0 16px;
  background: #fff;
  border-radius: 8px;
  padding: 4px 36px;
}

.base-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 16px;
  color: #606266;
  white-space: nowrap;
}

.code-text {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  word-break: break-all;
}

.timeline-wrap {
  margin: 8px 16px;
  padding: 2px 16px;
  background-color: #fff;
  border-radius: 12px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.process-item {
  margin-bottom: 4px;
  padding-left: 24px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.avatar-box {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item-type {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.item-company {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.info-list {
  position: relative;
  padding-left: 12px;
  margin-left: 6px;
}

/* 关键：蓝色竖线只出现在详情信息区左侧 */
.info-list::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #409eff;
}

.info-row {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.empty-box {
  margin-top: 120px;
  text-align: center;
}

.empty-text {
  margin-top: 10px;
  color: #909399;
}

@media screen and (max-width: 375px) {
  .base-card,
  .timeline-wrap {
    margin: 12px;
  }
}
</style>
