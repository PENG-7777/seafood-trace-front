<!-- src/views/node/wholBatch/add.vue -->
<!-- 批发商批号新增页面，布局样式完全对齐捕捞批号add.vue页面 -->
<!-- 业务说明：批发商上游原料只能选择【冷冻加工企业】已确认的成品批号 -->
<template>
  <!-- 页面根容器，弹性布局：顶部导航 + 滚动表单区域 + 底部Tab导航 -->
  <div class="whol-batch-add">
    <!-- 顶部固定导航栏 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">新建批发商产品批号</div>
    </div>
    <!-- 中间可滚动表单区域 -->
    <div class="scroll-container">
      <!-- 顶部业务宣传Banner -->
      <div class="banner-block">
        <div class="banner-text">
          <h1>食材溯源</h1>
          <p>源头追溯 保障食品安全</p>
        </div>
      </div>
      <!-- 表单主体区域 -->
      <div class="form-wrap">
        <!-- 批发商业务产品批号（必填） -->
        <div class="form-item">
          <label class="form-label">产品批号 <span class="required">*</span></label>
          <input
            v-model="form.batchId"
            type="text"
            class="form-input"
            placeholder="请输入批发商业务产品批号"
          />
        </div>
        <!-- 上游冷冻加工企业选择下拉框（复用公共上游企业接口） -->
        <div class="form-item">
          <label class="form-label">上游冷冻加工企业 <span class="required">*</span></label>
          <select v-model="selectedSourceNodeId" class="form-select" @change="handleNodeChange">
            <option value="">请选择上游冷冻加工企业</option>
            <option v-for="item in nodeList" :key="item.nodeId" :value="item.nodeId">
              {{ item.name }}（{{ item.code }}）
            </option>
          </select>
        </div>
        <!-- 上游成品加工批号二级联动下拉 -->
        <div class="form-item">
          <label class="form-label">上游加工成品批号 <span class="required">*</span></label>
          <select v-model="form.sourceBatchId" class="form-select" :disabled="!selectedSourceNodeId || loadingBatch">
            <option value="">
              <span v-if="loadingBatch">加载中...</span>
              <span v-else-if="selectedSourceNodeId && processBatchList.length === 0">该企业暂无可用成品批号</span>
              <span v-else>请先选择上游企业</span>
            </option>
            <option v-for="batch in processBatchList" :key="batch.sourceBatchId" :value="batch.sourceBatchId">
              {{ batch.batchId }}（{{ batch.type }}）
            </option>
          </select>
        </div>
        <!-- 海产品品种 -->
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input
            v-model="form.type"
            type="text"
            class="form-input"
            placeholder="例如：带鱼、三文鱼、冷冻虾"
          />
        </div>
        <!-- 质检报告编号 -->
        <div class="form-item">
          <label class="form-label">质检报告编号</label>
          <input
            v-model="form.reportId"
            type="text"
            class="form-input"
            placeholder="填写海产品质检报告编号"
          />
        </div>
        <!-- 检验人员名称 -->
        <div class="form-item">
          <label class="form-label">检验人员名称</label>
          <input
            v-model="form.testName"
            type="text"
            class="form-input"
            placeholder="填写质检工作人员姓名"
          />
        </div>
        <!-- 批号录入日期 -->
        <div class="form-item">
          <label class="form-label">批号录入日期</label>
          <input
            v-model="form.batchDate"
            type="date"
            class="form-input"
          />
        </div>
        <!-- 备注信息 -->
        <div class="form-item">
          <label class="form-label">备注</label>
          <textarea
            v-model="form.remarks"
            class="form-textarea"
            placeholder="补充备注信息（选填）"
            rows="4"
          ></textarea>
        </div>
        <!-- 提交保存按钮 -->
        <button class="btn-submit" @click="handleSubmit">保存批号</button>
      </div>
    </div>
    <!-- 底部固定Tab导航栏 -->
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
import { addWholBatch, getUpstreamProcessBatch } from '@/api/node/wholBatch'
import { getUpstreamNodeList } from '@/api/node/login'
import { useNodeUserStore } from '@/store/nodeUser'
import { storeToRefs } from 'pinia'

const router = useRouter()
const nodeStore = useNodeUserStore()
const { nodeId, nodeType } = storeToRefs(nodeStore)

// 表单绑定对象，字段完全对应whol_batch数据库表
const form = ref({
  batchId: '',
  sourceNodeType: 3, // 业务固定值：3=冷冻加工企业
  sourceBatchId: null,
  type: '',
  reportId: '',
  testName: '',
  batchDate: '',
  remarks: ''
})

// 选中的上游冷冻加工企业ID
const selectedSourceNodeId = ref('')
// 上游企业下拉选项集合（调用公共接口获取批发商对应的上游企业）
const nodeList = ref([])
// 二级联动：选中企业后加载该企业可用的成品加工批号
const processBatchList = ref([])
// 加载标记
const loadingBatch = ref(false)

/**
 * 页面挂载：加载一级上游企业下拉列表
 * targetNodeType：当前登录企业类型=4（批发商），后端自动返回type=3冷冻加工企业
 */
const loadUpstreamNodeOptions = async () => {
  try {
    const res = await getUpstreamNodeList(nodeType.value)
    if (res.code === 200) {
      nodeList.value = res.data
      console.log('上游企业列表：', nodeList.value)
    }
  } catch (err) {
    ElMessage.error('加载上游企业列表失败')
    console.error(err)
  }
}

// 监听上游企业下拉切换，请求该企业的成品批号列表
const handleNodeChange = async () => {
  // 清空旧数据
  processBatchList.value = []
  form.value.sourceBatchId = null

  if (!selectedSourceNodeId.value) {
    return
  }
  loadingBatch.value = true
  try {
    // 转为数字传给后端，避免字符串和数字匹配失败
    const sid = Number(selectedSourceNodeId.value)
    console.log('请求上游企业ID：', sid)
    const res = await getUpstreamProcessBatch(sid)
    console.log('后端返回成品批号：', res)
    if (res.code === 200) {
      processBatchList.value = res.data
      if(processBatchList.value.length === 0){
        ElMessage.info('该企业暂无已审核通过的成品批号')
      }
    }
  } catch (err) {
    ElMessage.error('加载上游成品批号失败')
    console.error('二级接口异常：', err)
  } finally {
    loadingBatch.value = false
  }
}

// 表单提交保存批发商批号
const handleSubmit = async () => {
  // 必填项校验
  if (!form.value.batchId) {
    ElMessage.warning('请填写产品批号')
    return
  }
  if (!form.value.sourceBatchId) {
    ElMessage.warning('请选择上游冷冻加工成品批号')
    return
  }
  if (!nodeId.value) {
    ElMessage.error('企业节点信息缺失，请退出账号重新登录')
    return
  }
  try {
    // nodeId、sourceNodeType后端强制控制，前端不需要传递
    const submitData = { ...form.value }
    const res = await addWholBatch(submitData)
    if (res.code === 200) {
      ElMessage.success('批发商产品批号创建成功')
      // 创建成功跳转到批发商批号列表页面
      router.push('/node/wholBatch/list')
    } else {
      ElMessage.error(res.msg || '新增批号失败')
    }
  } catch (error) {
    console.error('新增批发商批号异常：', error)
    ElMessage.error('提交失败，请检查网络或联系管理员')
  }
}

onMounted(() => {
  loadUpstreamNodeOptions()
})
</script>

<style scoped>
/* 页面整体布局，全屏弹性容器 */
.whol-batch-add {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* 顶部导航栏固定高度，不参与滚动 */
.page-header {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 22px;
  position: relative;
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
}
/* 返回箭头图标 */
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
/* 中间滚动区域，自动占满剩余可视高度 */
.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
/* 顶部业务宣传横幅 */
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
/* 表单外层边距 */
.form-wrap {
  padding: 10px 30px 30px;
}
/* 单行表单容器 */
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
/* 文本输入框样式 */
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:18px;
  padding:8px 0;
  outline: none;
}
/* 下拉选择框样式 */
.form-select {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size:18px;
  padding:8px 0;
  outline: none;
  background-color: #fff;
}
/* 多行文本域 */
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius:10px;
  font-size:18px;
  padding:16px;
  outline: none;
  box-sizing: border-box;
}
/* 提交按钮 */
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
/* 底部Tab导航栏，固定吸底 */
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
/* 底部导航图标尺寸 */
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
