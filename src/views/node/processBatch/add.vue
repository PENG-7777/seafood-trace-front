<template>
  <div class="process-batch-add">
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">新建冷冻加工批号</div>
    </div>
    <div class="scroll-container">
      <div class="banner-block">
        <div class="banner-text">
          <h1>食材溯源</h1>
          <p>源头追溯 保障食品安全</p>
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-item">
          <label class="form-label">成品业务批号 <span class="required">*</span></label>
          <input
            v-model="form.batchId"
            type="text"
            class="form-input"
            placeholder="请输入冷冻加工成品业务批号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">上游原料来源企业 <span class="required">*</span></label>
          <select v-model="form.sourceNodeId" class="form-input" @change="handleSourceNodeChange">
            <option value="">请选择上游原料企业</option>
            <option
              v-for="item in upstreamNodeList"
              :key="item.nodeId"
              :value="item.nodeId"
            >
              {{ item.name }}（{{ item.code }}）
            </option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label">上游原料批号 <span class="required">*</span></label>
          <select
            v-model="form.sourceBatchId"
            class="form-input"
            :disabled="!form.sourceNodeId"
            @change="debugBatchVal"
          >
            <option value="">请先选择上游企业，再选择原料批号</option>
            <option
              v-for="batch in upstreamBatchList"
              :key="batch.sourceBatchId"
              :value="batch.sourceBatchId"
            >
              {{ batch.batchId }}｜{{ batch.type || '未填写品种' }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label">海产品成品品种</label>
          <input
            v-model="form.type"
            type="text"
            class="form-input"
            placeholder="例如：冷冻带鱼、冷冻虾仁"
          />
        </div>
        <div class="form-item">
          <label class="form-label">加工生产流水编号</label>
          <input
            v-model="form.processNo"
            type="text"
            class="form-input"
            placeholder="填写加工车间生产流水编号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">加工操作人员</label>
          <input
            v-model="form.processPerson"
            type="text"
            class="form-input"
            placeholder="填写加工操作人员姓名"
          />
        </div>
        <div class="form-item">
          <label class="form-label">冷冻加工完成日期</label>
          <input
            v-model="form.processDate"
            type="date"
            class="form-input"
          />
        </div>
        <div class="form-item">
          <label class="form-label">冷冻仓储存放信息</label>
          <input
            v-model="form.coldStorageInfo"
            type="text"
            class="form-input"
            placeholder="填写冷库位置、仓位等存放信息"
          />
        </div>
        <div class="form-item">
          <label class="form-label">备注</label>
          <textarea
            v-model="form.remarks"
            class="form-textarea"
            placeholder="补充备注信息（选填）"
            rows="4"
          ></textarea>
        </div>
        <button class="btn-submit" @click="handleSubmit">保存批号</button>
      </div>
    </div>
    <div class="tab-bar">
      <div class="tab-item active" @click="$router.push('/node/home')">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <div class="tab-item" @click="$router.push('/node/mine')">
        <div class="icon-my"></div>
        <span>我的</span>
      </div>
      <div class="tab-item" @click="$router.push('/node/password')">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useNodeUserStore } from '@/store/nodeUser'
import { storeToRefs } from 'pinia'
import { addProcessBatch, getUpstreamBatchByNodeId } from '@/api/node/processBatch'
import { getUpstreamNodeList } from '@/api/node/login'

const router = useRouter()
const nodeStore = useNodeUserStore()
const { nodeId, nodeType } = storeToRefs(nodeStore)

const upstreamNodeList = ref([])
const upstreamBatchList = ref([])

const form = reactive({
  batchId: '',
  sourceNodeId: '',
  sourceBatchId: null,
  sourceNodeType: null,
  type: '',
  processNo: '',
  processPerson: '',
  processDate: '',
  coldStorageInfo: '',
  remarks: '',
  nodeId: null
})

onMounted(async () => {
  if (nodeType.value === undefined || nodeType.value === null) {
    ElMessage.error('获取当前企业类型失败，请重新登录！')
    return
  }
  try {
    const res = await getUpstreamNodeList(nodeType.value)
    if (res.code === 200) {
      upstreamNodeList.value = res.data || []
    }
  } catch (err) {
    ElMessage.error('加载上游企业列表失败')
    console.error(err)
  }
})

const handleSourceNodeChange = async () => {
  form.sourceBatchId = null
  form.sourceNodeType = null
  upstreamBatchList.value = []
  if (!form.sourceNodeId) return

  const selectedNode = upstreamNodeList.value.find(item => item.nodeId === form.sourceNodeId)
  if (selectedNode) {
    form.sourceNodeType = selectedNode.type
  }

  try {
    const res = await getUpstreamBatchByNodeId(form.sourceNodeId)
    if (res.code === 200) {
      upstreamBatchList.value = res.data || []
      if (upstreamBatchList.value.length === 0) {
        ElMessage.warning('该上游企业暂无【已发布】的原料批号')
      }
    }
  } catch (error) {
    ElMessage.error('加载原料批号失败')
    console.error(error)
  }
}

const debugBatchVal = () => {
  console.log('✅ 当前选中sourceBatchId = ', form.sourceBatchId)
}

const handleSubmit = async () => {
  console.log('【提交完整表单】', JSON.parse(JSON.stringify(form)))
  console.log('【单独取值 sourceBatchId】', form.sourceBatchId)

  if (!form.batchId) {
    ElMessage.warning('请填写成品业务批号')
    return
  }
  if (!form.sourceNodeId) {
    ElMessage.warning('请选择上游原料来源企业')
    return
  }
  if (form.sourceBatchId === null || form.sourceBatchId === '') {
    ElMessage.warning('请选择上游原料批号')
    return
  }
  if (!form.sourceNodeType) {
    ElMessage.warning('上游企业类型获取失败，请重新选择企业')
    return
  }
  if (!nodeId.value) {
    ElMessage.error('企业节点信息缺失，请退出账号重新登录')
    return
  }

  form.nodeId = nodeId.value

  try {
    const res = await addProcessBatch(form)
    ElMessage.success('冷冻加工批号创建成功')
    router.push('/node/processBatch/list')
  } catch (error) {
    console.error('新增冷冻加工批号失败：', error)
    ElMessage.error(error.message || '提交失败，请检查网络或联系管理员')
  }
}
</script>

<style scoped>
.process-batch-add {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-header {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 22px;
  position: relative;
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
}
.back-icon {
  position: absolute;
  left: 12px;
  top: 16px;
  width: 20px;
  height: 20px;
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
.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
  background: rgba(0, 80, 40, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}
.form-wrap {
  padding: 10px 30px 30px;
}
.form-item {
  margin-bottom: 6px;
}
.form-label {
  font-size: 18px;
  color: #666;
  display: block;
  margin-bottom: 6px;
}
.required {
  color: red;
}
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size: 16px;
  padding: 8px 0;
  outline: none;
}
.form-input:disabled {
  color:#999;
  background:#f9f9f9;
}
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 18px;
  padding: 16px;
  outline: none;
  box-sizing: border-box;
}
.btn-submit {
  width: 100%;
  height: 40px;
  background-color: #39b568;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 22px;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: 60px;
  align-items: center;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  color: #999;
  gap: 1px;
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
