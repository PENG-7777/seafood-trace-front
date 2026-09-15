<!-- src/views/node/retaBatch/list.vue -->
<!-- 流通节点端：零售商批号管理列表页面 -->
<!-- UI布局、配色、交互逻辑完全对齐批发商批号管理 wholBatch/list.vue -->
<!-- 业务状态说明：
state=1【新建】｜state=2【待上游确认】｜state=3【已确认上架】｜state=4【已下架】
1. state=1新建：支持查看详情、编辑、删除、向上游批发商发送进场确认请求
2. state=2待确认：仅查看详情，不可编辑删除
3. state=3已确认上架：支持查看详情、单条下架操作；点击卡片打开详情弹窗，移除卡片勾选批量下架，改为单条下架按钮
4. state=4已下架：仅查看详情
溯源码支持一键复制、生成二维码并保存本地
-->
<template>
  <div class="reta-batch-list">
    <!-- 顶部标题返回栏，固定高度不滚动 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">零售商产品批号管理</div>
    </div>
    <!-- 页面主体可滚动区域 -->
    <div class="scroll-container">
      <!-- 顶部业务宣传Banner -->
      <div class="banner-block">
        <div class="banner-text">
          <h1>食材溯源</h1>
          <p>源头追溯 保障食品安全</p>
        </div>
      </div>
      <!-- ====================== 新建区块 state = 1 ====================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">新建</span>
          <span class="section-count">{{ draftList.length }} 条</span>
        </div>
        <!-- 空数据提示 -->
        <div v-if="draftList.length === 0" class="empty-tip">暂无新建的零售商批号</div>
        <!-- 新建批号卡片循环渲染 -->
        <div class="batch-card" v-for="item in draftList" :key="item.rbId">
          <div class="card-row">
            <span class="label">零售商业务批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">上游批发批号ID：</span>
            <span>{{ item.wbId || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">录入日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">备注：</span>
            <span>{{ item.remarks || '-' }}</span>
          </div>
          <!-- 操作按钮组：查看详情｜更新｜删除｜发送进场确认请求 -->
          <div class="btn-operation">
            <button class="btn-detail" @click="openDetail(item)">查看详情</button>
            <button class="btn-edit" @click="openEdit(item)">更新</button>
            <button class="btn-del" @click="handleDelete(item.rbId)">删除</button>
            <button class="btn-send-confirm" @click="handleSendConfirmReq(item.rbId)">发布</button>
          </div>
        </div>
      </div>
      <!-- ====================== 待上游确认区块 state = 2 ====================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">待上游确认</span>
          <span class="section-count">{{ waitConfirmList.length }} 条</span>
        </div>
        <div v-if="waitConfirmList.length === 0" class="empty-tip">暂无待上游确认的批号</div>
        <div class="batch-card" v-for="item in waitConfirmList" :key="item.rbId">
          <div class="card-row">
            <span class="label">零售商业务批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">上游批发批号ID：</span>
            <span>{{ item.wbId || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">录入日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
          <div class="btn-operation">
            <button class="btn-detail" @click="openDetail(item)">查看详情</button>
          </div>
        </div>
      </div>
      <!-- ====================== 已确认上架区块 state = 3 ====================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">已确认上架</span>
          <span class="section-count">{{ onSaleList.length }} 条</span>
        </div>
        <div v-if="onSaleList.length === 0" class="empty-tip">暂无已确认上架的批号</div>
        <!-- 已上架批号卡片：点击卡片打开详情弹窗，单条独立下架按钮 -->
        <div
          class="batch-card published-card"
          v-for="item in onSaleList"
          :key="item.rbId"
          @click="openDetail(item)"
        >
          <div class="card-row">
            <span class="label">零售商业务批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">上游批发批号ID：</span>
            <span>{{ item.wbId || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">溯源码sourceId：</span>
            <span class="source-id" @click.stop="copySourceId(item.sourceId)">{{ item.sourceId || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">录入日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
          <div class="btn-operation">
            <button class="btn-detail">查看详情</button>
            <button class="btn-qr" @click.stop="openQrCode(item)">二维码</button>
            <button class="btn-off-single" @click.stop="handleSingleOffShelve(item.rbId)">下架</button>
          </div>
        </div>
      </div>
      <!-- ====================== 已下架区块 state = 4 ====================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">已下架</span>
          <span class="section-count">{{ offSaleList.length }} 条</span>
        </div>
        <div v-if="offSaleList.length === 0" class="empty-tip">暂无已下架的批号</div>
        <div class="batch-card" v-for="item in offSaleList" :key="item.rbId">
          <div class="card-row">
            <span class="label">零售商业务批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">上游批发批号ID：</span>
            <span>{{ item.wbId || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">录入日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
          <div class="btn-operation">
            <button class="btn-detail" @click="openDetail(item)">查看详情</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部Tab导航栏，固定吸底 -->
    <div class="tab-bar">
      <div class="tab-item" @click="$router.push('/node/home')">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <div class="tab-item active" @click="$router.push('/node/retaBatch/list')">
        <div class="icon-my"></div>
        <span>我的</span>
      </div>
      <div class="tab-item" @click="$router.push('/node/password')">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
    <!-- ====================== 编辑弹窗 ====================== -->
    <div v-if="editDialogVisible" class="dialog-mask" @click.self="editDialogVisible = false">
      <div class="dialog-box">
        <div class="dialog-title">更新零售商产品批号</div>
        <div class="form-item">
          <label class="form-label">零售商业务批号 <span class="required">*</span></label>
          <input v-model="editForm.batchId" class="form-input" placeholder="请输入零售商业务批号" />
        </div>
        <div class="form-item">
          <label class="form-label">上游批发成品批号ID</label>
          <input v-model.number="editForm.wbId" type="number" class="form-input" placeholder="上游批发成品批号主键ID" />
        </div>
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input v-model="editForm.type" class="form-input" placeholder="例如：冷冻三文鱼" />
        </div>
        <div class="form-item">
          <label class="form-label">批号录入日期</label>
          <input v-model="editForm.batchDate" type="date" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">备注</label>
          <textarea v-model="editForm.remarks" class="form-textarea"></textarea>
        </div>
        <div class="dialog-btn-group">
          <button class="btn-cancel" @click="editDialogVisible = false">取消</button>
          <button class="btn-save" @click="submitEdit">保存修改</button>
        </div>
      </div>
    </div>
    <!-- ====================== 详情弹窗（新增二维码模块） ====================== -->
    <div v-if="detailDialogVisible" class="dialog-mask" @click.self="detailDialogVisible = false">
      <div class="dialog-box">
        <div class="dialog-title">零售商批号详情</div>
        <div class="detail-row">
          <span class="detail-label">零售商业务批号：</span>
          <span>{{ detailForm.batchId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">上游批发成品批号ID：</span>
          <span>{{ detailForm.wbId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">海产品品种：</span>
          <span>{{ detailForm.type || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">溯源码sourceId：</span>
          <span class="source-id" @click="copySourceId(detailForm.sourceId)">{{ detailForm.sourceId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">批号录入日期：</span>
          <span>{{ detailForm.batchDate || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">备注：</span>
          <span>{{ detailForm.remarks || '-' }}</span>
        </div>
        <!-- 溯源二维码区域 -->
        <div class="qr-section">
          <div class="qr-title">溯源二维码</div>
          <div class="qr-content">
            <div v-if="qrLoading" class="qr-loading">二维码生成中...</div>
            <img v-else-if="qrCodeImg" :src="qrCodeImg" alt="溯源二维码" class="qr-image" />
            <div v-else class="qr-empty">暂无溯源二维码</div>
          </div>
          <button v-if="qrCodeImg" class="btn-download-qr" @click="downloadQrCode">
            保存二维码到本地
          </button>
        </div>
        <div class="dialog-btn-group">
          <button class="btn-save" @click="detailDialogVisible = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入零售商批号管理接口方法
import {
  getRetaBatchList,
  updateRetaBatch,
  deleteRetaBatch,
  offShelveRetaBatch,
  sendRetaConfirmRequest,
  getRetaBatchQrCode
} from '@/api/node/retaBatch'

// 完整零售商批号列表原始数据
const batchList = ref([])
// 编辑弹窗控制变量与编辑表单
const editDialogVisible = ref(false)
const editForm = ref({})
// 详情弹窗控制变量与详情表单
const detailDialogVisible = ref(false)
const detailForm = ref({})
// 二维码相关变量
const qrCodeImg = ref('')
const qrLoading = ref(false)
/**
 * 计算属性：过滤 state=1 新建状态批号
 */
const draftList = computed(() => batchList.value.filter(item => item.state === 1))
/**
 * 计算属性：过滤 state=2 待上游确认批号
 */
const waitConfirmList = computed(() => batchList.value.filter(item => item.state === 2))
/**
 * 计算属性：过滤 state=3 已确认上架批号
 */
const onSaleList = computed(() => batchList.value.filter(item => item.state === 3))
/**
 * 计算属性：过滤 state=4 已下架批号
 */
const offSaleList = computed(() => batchList.value.filter(item => item.state === 4))
/**
 * 加载当前登录零售商企业的全部批号数据
 */
const loadBatchList = async () => {
  const res = await getRetaBatchList()
  if (res.code === 200) {
    batchList.value = res.data || []
  }
}
/**
 * 打开详情弹窗，数据浅拷贝回填表单
 * 有溯源码时自动生成对应二维码
 * @param {Object} row 当前行批号对象
 */
const openDetail = (row) => {
  detailForm.value = { ...row }
  detailDialogVisible.value = true
  // 存在溯源码时自动生成二维码
  if (row.sourceId) {
    generateQrCode(row.sourceId)
  } else {
    qrCodeImg.value = ''
  }
}
/**
 * 快捷打开二维码（卡片按钮直接调用）
 * @param {Object} row 当前行批号对象
 */
const openQrCode = (row) => {
  openDetail(row)
}
/**
 * 调用后端接口生成溯源二维码Base64
 * @param {String} sourceId 溯源编号
 */
const generateQrCode = async (sourceId) => {
  try {
    qrLoading.value = true
    qrCodeImg.value = ''
    const res = await getRetaBatchQrCode(sourceId)
    if (res.code === 200) {
      // 后端返回纯Base64，拼接图片前缀后渲染
      qrCodeImg.value = `data:image/png;base64,${res.data}`
    } else {
      ElMessage.error(res.msg || '二维码生成失败')
    }
  } catch (error) {
    console.error('生成二维码异常：', error)
    qrCodeImg.value = ''
    // 捕获业务错误，提示用户
    if (error.code !== undefined) {
      ElMessage.error(error.msg || '二维码生成失败')
    } else {
      ElMessage.error('网络异常，请稍后重试')
    }
  } finally {
    qrLoading.value = false
  }
}
/**
 * 下载二维码图片到本地
 */
const downloadQrCode = () => {
  if (!qrCodeImg.value) {
    ElMessage.warning('二维码未生成，无法保存')
    return
  }
  const link = document.createElement('a')
  link.href = qrCodeImg.value
  // 文件名自动携带溯源编号
  link.download = `溯源二维码_${detailForm.value.sourceId}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('二维码已保存到本地')
}
/**
 * 打开编辑弹窗，回填数据
 * @param {Object} row 当前行批号对象
 */
const openEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}
/**
 * 提交编辑保存，调用后端修改接口
 */
const submitEdit = async () => {
  if (!editForm.value.batchId) {
    ElMessage.warning('零售商业务批号不能为空')
    return
  }
  const res = await updateRetaBatch(editForm.value)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    loadBatchList()
  }
}
/**
 * 删除单条零售商批号
 * @param {Number} rbId 零售商批号主键rbId
 */
const handleDelete = async (rbId) => {
  ElMessageBox.confirm('确认删除这条零售商批号？删除后不可恢复', '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteRetaBatch(rbId)
    ElMessage.success('删除成功')
    loadBatchList()
  }).catch(() => {})
}
/**
 * 向上游批发商发送进场确认请求，状态变更为2-待确认
 * @param {Number} rbId 零售商批号主键
 */
const handleSendConfirmReq = async (rbId) => {
  ElMessageBox.confirm('确认向上游发送进场确认请求？', '提示').then(async () => {
    const res = await sendRetaConfirmRequest(rbId)
    if (res.code === 200) {
      ElMessage.success('进场请求发送成功，等待上游企业确认')
      loadBatchList()
    }
  })
}
/**
 * 单条下架
 * @param {Number} rbId 批号主键
 */
const handleSingleOffShelve = async (rbId) => {
  ElMessageBox.confirm('确认下架该批号？', '提示').then(async () => {
    const res = await offShelveRetaBatch(rbId)
    if (res.code === 200) {
      ElMessage.success('下架成功')
      loadBatchList()
    }
  }).catch(() => {})
}
/**
 * 复制溯源码sourceId
 * @param {String} sourceId 溯源码
 */
const copySourceId = async (sourceId) => {
  if (!sourceId || sourceId === '-') {
    ElMessage.warning('溯源码为空，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(sourceId)
    ElMessage.success('溯源码已复制')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}
// 页面挂载完成后加载批号列表
onMounted(() => {
  loadBatchList()
})
</script>
<style scoped>
.reta-batch-list {
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
.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
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
.section {
  padding: 0 20px;
  margin-top: 20px;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.section-count {
  font-size: 14px;
  color: #999;
  margin-left: 8px;
}
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 30px 0;
  background: #fafafa;
  border-radius: 12px;
}
.batch-card {
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
}
.published-card {
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.published-card:hover {
  border-color: #0052D4;
}
.card-row {
  font-size: 14px;
  line-height: 18px;
}
.label {
  color: #666;
  font-size: 14px;
}
.source-id {
  color: #0052D4;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}
.btn-operation {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.btn-operation button {
  flex: 1;
  min-width: 40px;
  height: 30px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}
.btn-detail {
  background: #e2e3e5;
  color: #383d41;
}
.btn-edit {
  background: #cfe2ff;
  color: #084298;
}
.btn-del {
  background: #f8d7da;
  color: #b02a37;
}
.btn-send-confirm {
  background:#fff3cd;
  color:#856404;
}
.btn-qr {
  background: #d1e7dd;
  color: #0f5132;
}
.btn-off-single {
  background: #f46b6b;
  color: #fff;
}
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog-box {
  width: 85%;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  max-height: 75vh;
  overflow-y: auto;
}
.dialog-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 16px;
}
.detail-row {
  font-size: 16px;
  line-height: 34px;
  border-bottom: 1px dashed #eee;
}
.detail-label {
  color: #666;
}
.form-item {
  margin-bottom: 12px;
}
.form-label {
  font-size: 16px;
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
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 16px;
  padding:12px;
  outline: none;
  box-sizing: border-box;
}
.dialog-btn-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.btn-cancel {
  flex:1;
  height:40px;
  border-radius:12px;
  border:1px solid #ccc;
  background:#fff;
  font-size:16px;
  cursor: pointer;
}
.btn-save {
  flex:1;
  height:40px;
  border-radius:12px;
  border:none;
  background:#39b568;
  color:#fff;
  font-size:16px;
  cursor: pointer;
}
/* 溯源二维码区域样式 */
.qr-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
  text-align: center;
}
.qr-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}
.qr-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.qr-loading,
.qr-empty {
  width: 160px;
  height: 160px;
  line-height: 160px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
}
.qr-image {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #eee;
}
.btn-download-qr {
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #0052D4;
  color: #fff;
  font-size: 14px;
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
