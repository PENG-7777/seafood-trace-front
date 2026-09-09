<template>
  <div class="reta-batch-add">
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">新建零售商产品批号</div>
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
          <label class="form-label">产品批号 <span class="required">*</span></label>
          <input
            v-model="form.batchId"
            type="text"
            class="form-input"
            placeholder="请输入零售商业务产品批号"
          />
        </div>
        <div class="form-item">
          <label class="form-label">上游批发商企业 <span class="required">*</span></label>
          <select v-model="selectedSourceNodeId" class="form-select" @change="handleNodeChange">
            <option value="">请选择上游批发商企业</option>
            <option v-for="item in nodeList" :key="item.nodeId" :value="item.nodeId">
              {{ item.name }}（{{ item.code }}）
            </option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label">上游批发成品批号 <span class="required">*</span></label>
          <select
            v-model="form.wbId"
            class="form-select"
            :disabled="!selectedSourceNodeId || loadingBatch"
            @change="handleBatchChange"
          >
            <option value="0">
              <span v-if="loadingBatch">加载中...</span>
              <span v-else-if="selectedSourceNodeId && wholBatchList.length === 0">该企业暂无可用成品批号</span>
              <span v-else>请先选择上游企业</span>
            </option>
            <!-- ✅ 修改为后端真实字段 sourceBatchId -->
            <option v-for="batch in wholBatchList" :key="batch.sourceBatchId" :value="batch.sourceBatchId">
              {{ batch.batchId }}（{{ batch.type }}）
            </option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input
            v-model="form.type"
            type="text"
            class="form-input"
            placeholder="例如：带鱼、三文鱼、冷冻虾"
          />
        </div>
        <div class="form-item">
          <label class="form-label">批号录入日期</label>
          <input
            v-model="form.batchDate"
            type="date"
            class="form-input"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addRetaBatch, getUpstreamWholBatch } from '@/api/node/retaBatch'
import { getUpstreamNodeList } from '@/api/node/login'
import { useNodeUserStore } from '@/store/nodeUser'
import { storeToRefs } from 'pinia'

const router = useRouter()
const nodeStore = useNodeUserStore()
const { nodeId, nodeType } = storeToRefs(nodeStore)

const form = ref({
  batchId: '',
  wbId: "0",
  type: '',
  batchDate: '',
  remarks: ''
})

const selectedSourceNodeId = ref('')
const nodeList = ref([])
const wholBatchList = ref([])
const loadingBatch = ref(false)

const loadUpstreamNodeOptions = async () => {
  try {
    const res = await getUpstreamNodeList(nodeType.value)
    if (res.code === 200) {
      nodeList.value = res.data
    }
  } catch (err) {
    ElMessage.error('加载上游企业列表失败')
    console.error(err)
  }
}

const handleNodeChange = async () => {
  wholBatchList.value = []
  form.value.wbId = "0"
  form.value.type = ''
  if (!selectedSourceNodeId.value) {
    return
  }
  loadingBatch.value = true
  try {
    const sid = Number(selectedSourceNodeId.value)
    const res = await getUpstreamWholBatch(sid)
    console.log('后端返回批发成品批号：', res)
    if(res.data && res.data.length > 0){
      console.log('单条批号对象：', res.data[0])
    }
    if (res.code === 200) {
      wholBatchList.value = res.data
      if (wholBatchList.value.length === 0) {
        ElMessage.info('该企业暂无已审核通过的批发成品批号')
      }
    }
  } catch (err) {
    ElMessage.error('加载上游批发批号失败')
    console.error('二级联动接口异常：', err)
  } finally {
    loadingBatch.value = false
  }
}

const handleBatchChange = () => {
  console.log('下拉选中值：', form.value.wbId)
  // ✅ 使用 sourceBatchId 匹配数组对象
  const selectedItem = wholBatchList.value.find(item => item.sourceBatchId === Number(form.value.wbId))
  if (selectedItem) {
    form.value.type = selectedItem.type
  } else {
    form.value.type = ''
  }
}

const handleSubmit = async () => {
  console.log("=====提交调试信息=====")
  console.log(form.value)

  if (!form.value.batchId) {
    ElMessage.warning('请填写产品批号')
    return
  }

  const submitWbId = Number(form.value.wbId)
  if (!submitWbId || submitWbId <= 0) {
    ElMessage.warning('请选择上游批发成品批号')
    return
  }

  if (!nodeId.value) {
    ElMessage.error('企业节点信息缺失，请退出账号重新登录')
    return
  }
  try {
    const submitData = {
      ...form.value,
      wbId: submitWbId
    }
    console.log("提交给后端的数据：", submitData)
    const res = await addRetaBatch(submitData)
    if (res.code === 200) {
      ElMessage.success('零售商产品批号创建成功')
      router.push('/node/retaBatch/list')
    } else {
      ElMessage.error(res.msg || '新增批号失败')
    }
  } catch (error) {
    console.error('新增零售商批号异常：', error)
    ElMessage.error('提交失败，请检查网络或联系管理员')
  }
}

onMounted(() => {
  loadUpstreamNodeOptions()
})
</script>

<style scoped>
.reta-batch-add {
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
  top:16px;
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
  background: rgba(0,80,40,0.4);
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
  margin-bottom:6px;
}
.required {
  color: red;
}
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:18px;
  padding:8px 0;
  outline: none;
}
.form-select {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:18px;
  padding:8px 0;
  outline: none;
  background-color: #fff;
}
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius:10px;
  font-size:18px;
  padding:16px;
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
  margin-top:10px;
  margin-bottom:10px;
  cursor: pointer;
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
  color:#0052D4;
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
