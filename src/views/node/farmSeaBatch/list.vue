<template>
  <div class="farm-sea-batch-list">
    <!-- 顶部标题返回栏，固定高度不滚动 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">养殖批号管理</div>
    </div>
    <!-- 可滚动区域 -->
    <div class="scroll-container">
      <!-- 顶部业务Banner -->
      <div class="banner-block">
        <div class="banner-text">
          <h1>食材溯源</h1>
          <p>源头追溯 保障食品安全</p>
        </div>
      </div>
      <!-- ==================== 待发布区块 state=1 ==================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">待发布</span>
          <span class="section-count">{{ draftList.length }} 条</span>
        </div>
        <div v-if="draftList.length === 0" class="empty-tip">暂无待发布的批号</div>
        <div class="batch-card" v-for="item in draftList" :key="item.fsbId">
          <div class="card-row">
            <span class="label">产品批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">养殖基地地址：</span>
            <span>{{ item.farmAddr || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">出栏日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
          <!-- 操作按钮：查看详情、更新、删除、发布上架 -->
          <div class="btn-operation">
            <button class="btn-detail" @click="openDetail(item)">查看详情</button>
            <button class="btn-edit" @click="openEdit(item)">更新</button>
            <button class="btn-del" @click="handleDelete(item.fsbId)">删除</button>
            <button class="btn-publish" @click="handlePublish(item)">发布上架</button>
          </div>
        </div>
      </div>
      <!-- ==================== 已发布区块 state=2 ==================== -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">已发布</span>
          <span class="section-count">{{ publishedList.length }} 条</span>
          <button
            class="btn-batch-off"
            :disabled="selectedIds.length === 0"
            @click="handleBatchOffShelve"
          >
            下架选中({{ selectedIds.length }})
          </button>
        </div>
        <div v-if="publishedList.length === 0" class="empty-tip">暂无已发布的批号</div>
        <div
          class="batch-card published-card"
          v-for="item in publishedList"
          :key="item.fsbId"
          :class="{ selected: selectedIds.includes(item.fsbId) }"
          @click="toggleSelect(item.fsbId)"
        >
          <div class="select-row">
            <span class="checkbox" :class="{ checked: selectedIds.includes(item.fsbId) }"></span>
            <span class="select-text">点击选中下架</span>
          </div>
          <div class="card-row">
            <span class="label">产品批号：</span>
            <span>{{ item.batchId }}</span>
          </div>
          <div class="card-row">
            <span class="label">海产品品种：</span>
            <span>{{ item.type || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">养殖基地地址：</span>
            <span>{{ item.farmAddr || '-' }}</span>
          </div>
          <div class="card-row">
            <span class="label">出栏日期：</span>
            <span>{{ item.batchDate || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部导航栏，固定吸底 -->
    <div class="tab-bar">
      <div class="tab-item" @click="$router.push('/node/home')">
        <div class="icon-home"></div>
        <span>首页</span>
      </div>
      <div class="tab-item active" @click="$router.push('/node/farmSeaBatch/list')">
        <div class="icon-my"></div>
        <span>我的</span>
      </div>
      <div class="tab-item" @click="$router.push('/node/password')">
        <div class="icon-pwd"></div>
        <span>更新密码</span>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <div v-if="editDialogVisible" class="dialog-mask" @click.self="editDialogVisible = false">
      <div class="dialog-box">
        <div class="dialog-title">更新养殖批号</div>
        <div class="form-item">
          <label class="form-label">产品批号 <span class="required">*</span></label>
          <input v-model="editForm.batchId" class="form-input" placeholder="请输入批号" />
        </div>
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input v-model="editForm.type" class="form-input" placeholder="海产品品种" />
        </div>
        <div class="form-item">
          <label class="form-label">水域滩涂养殖证编号</label>
          <input v-model="editForm.aquaLicId" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">检疫人员</label>
          <input v-model="editForm.testName" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">养殖基地地址</label>
          <input v-model="editForm.farmAddr" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">海产品出栏日期</label>
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
    <!-- 详情弹窗 -->
    <div v-if="detailDialogVisible" class="dialog-mask" @click.self="detailDialogVisible = false">
      <div class="dialog-box">
        <div class="dialog-title">批号详情</div>
        <div class="detail-row">
          <span class="detail-label">产品批号：</span>
          <span>{{ detailForm.batchId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">海产品品种：</span>
          <span>{{ detailForm.type || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">水域滩涂养殖证编号：</span>
          <span>{{ detailForm.aquaLicId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">检疫人员：</span>
          <span>{{ detailForm.testName || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">养殖基地地址：</span>
          <span>{{ detailForm.farmAddr || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">海产品出栏日期：</span>
          <span>{{ detailForm.batchDate || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">备注：</span>
          <span>{{ detailForm.remarks || '-' }}</span>
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
// 只保留唯一一次接口导入，删除重复import
import {
  getMyFarmSeaBatchList,
  updateFarmSeaBatch,
  deleteFarmSeaBatch,
  offShelveFarmSeaBatch
} from '@/api/node/farmSeaBatch'

/**
 * batchList：保存当前登录养殖企业全部批号数据
 */
const batchList = ref([])
/**
 * editDialogVisible：编辑弹窗显示控制变量
 */
const editDialogVisible = ref(false)
/**
 * editForm：编辑弹窗绑定表单对象
 */
const editForm = ref({})
/**
 * detailDialogVisible：详情弹窗显示控制变量
 */
const detailDialogVisible = ref(false)
/**
 * detailForm：详情弹窗绑定数据对象
 */
const detailForm = ref({})
/**
 * selectedIds：批量下架选中主键id数组
 */
const selectedIds = ref([])

/**
 * 计算属性draftList：过滤状态state=1 待发布批号
 */
const draftList = computed(() => batchList.value.filter(item => item.state === 1))
/**
 * 计算属性publishedList：过滤状态state=2 已发布批号
 */
const publishedList = computed(() => batchList.value.filter(item => item.state === 2))

/**
 * 加载当前养殖企业的批号列表
 * 接口地址：GET /node/farmSeaBatch/list
 * 后端自动获取登录nodeId，前端无需传参
 */
const loadBatchList = async () => {
  const res = await getMyFarmSeaBatchList()
  if (res.code === 200) {
    batchList.value = res.data || []
  }
  // 刷新列表清空批量选中集合
  selectedIds.value = []
}

/**
 * 打开详情弹窗，赋值行数据
 * @param {Object} row 当前行完整批号对象
 */
const openDetail = (row) => {
  detailForm.value = { ...row }
  detailDialogVisible.value = true
}

/**
 * 打开编辑弹窗，回填该行数据至编辑表单
 * @param {Object} row 当前行完整批号对象
 */
const openEdit = (row) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

/**
 * 提交编辑保存接口
 * 接口地址：PUT /node/farmSeaBatch/update
 */
const submitEdit = async () => {
  if (!editForm.value.batchId) {
    ElMessage.warning('产品批号不能为空')
    return
  }
  const res = await updateFarmSeaBatch(editForm.value)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    loadBatchList()
  }
}

/**
 * 删除单条养殖批号
 * 接口地址：DELETE /node/farmSeaBatch/delete/{fsbId}
 * @param {Number} fsbId 养殖批号主键
 */
const handleDelete = async (fsbId) => {
  ElMessageBox.confirm('确认删除这条养殖批号？删除后不可恢复', '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteFarmSeaBatch(fsbId)
    ElMessage.success('删除成功')
    loadBatchList()
  }).catch(() => {})
}

/**
 * 发布上架操作：修改state状态为2，调用更新接口
 * @param {Object} row 当前批号行数据
 */
const handlePublish = async (row) => {
  ElMessageBox.confirm('确认发布上架该批号？发布后不可编辑', '提示').then(async () => {
    row.state = 2
    await updateFarmSeaBatch(row)
    ElMessage.success('发布上架成功')
    loadBatchList()
  })
}

/**
 * 单选切换批量下架选中状态
 * @param {Number} fsbId 批号主键
 */
const toggleSelect = (fsbId) => {
  const idx = selectedIds.value.indexOf(fsbId)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(fsbId)
  }
}

/**
 * 批量下架循环调用下架接口
 * 接口地址：PUT /node/farmSeaBatch/offShelve/{fsbId}
 */
const handleBatchOffShelve = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选中要下架的批号')
    return
  }
  ElMessageBox.confirm(`确认下架选中的 ${selectedIds.value.length} 个产品批号？`, '提示').then(async () => {
    try {
      for (const id of selectedIds.value) {
        await offShelveFarmSeaBatch(id)
      }
      ElMessage.success('批量下架成功')
      loadBatchList()
    } catch (err) {
      ElMessage.error('部分批号下架失败')
      loadBatchList()
    }
  }).catch(() => {})
}

/**
 * Vue生命周期：页面挂载后自动加载批号列表
 */
onMounted(() => {
  loadBatchList()
})
</script>

<style scoped>
.farm-sea-batch-list {
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
.btn-batch-off {
  margin-left: auto;
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 16px;
  background: #f46b6b;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.btn-batch-off:disabled {
  background: #ccc;
  cursor: not-allowed;
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
.published-card.selected {
  border: 2px solid #f46b6b;
  background: #fff5f5;
}
.select-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
}
.checkbox.checked {
  background: #f46b6b;
  border-color: #f46b6b;
}
.checkbox.checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.select-text {
  margin-left: 8px;
  font-size: 14px;
  color: #999;
}
.card-row {
  font-size: 16px;
  line-height: 32px;
}
.label {
  color: #666;
}
.btn-operation {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}
.btn-operation button {
  flex: 1;
  height: 40px;
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
.btn-publish {
  background:#d1e7dd;
  color:#0f5132;
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
