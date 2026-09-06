<template>
  <div class="fish-batch-list">
    <!-- 顶部标题返回栏 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()">&lt;</div>
      <div class="title">产品批号管理</div>
    </div>

    <!-- 顶部业务Banner -->
    <div class="banner-block">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>

    <!-- 新增按钮 -->
    <div class="btn-add-wrap">
      <button class="btn-add" @click="$router.push('/node/fishBatch/add')">+ 新建产品批号</button>
    </div>

    <!-- 批号列表容器 -->
    <div class="list-wrap">
      <!-- 循环渲染每一条批号卡片 -->
      <div class="batch-card" v-for="item in batchList" :key="item.fbId">
        <div class="card-row">
          <span class="label">产品批号：</span>
          <span>{{ item.batchId }}</span>
        </div>
        <div class="card-row">
          <span class="label">海产品品种：</span>
          <span>{{ item.type || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">捕捞海域：</span>
          <span>{{ item.seaArea || '-' }}</span>
        </div>
        <div class="card-row">
          <span class="label">出海日期：</span>
          <span>{{ item.batchDate || '-' }}</span>
        </div>
        <!-- 状态标签 1待发布 2已发布 3已下架 -->
        <div class="card-row">
          <span class="label">批号状态：</span>
          <span
            class="state-tag"
            :class="{
              draft: item.state === 1,
              publish: item.state === 2,
              off: item.state === 3
            }"
          >
            {{ getStateText(item.state) }}
          </span>
        </div>

        <!-- 操作按钮区域，根据状态动态展示可用操作 -->
        <div class="btn-operation">
          <!-- 待发布：可编辑、删除、发布 -->
          <template v-if="item.state === 1">
            <button class="btn-edit" @click="openEdit(item)">编辑</button>
            <button class="btn-del" @click="handleDelete(item.fbId)">删除</button>
            <button class="btn-publish" @click="handlePublish(item)">发布上架</button>
          </template>
          <!-- 已发布：仅可下架 -->
          <template v-if="item.state === 2">
            <button class="btn-off" @click="handleOffShelve(item.fbId)">下架</button>
          </template>
          <!-- 已下架：无业务操作 -->
          <template v-if="item.state === 3">
            <span class="tip-text">该批号已下架</span>
          </template>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="editDialogVisible" class="dialog-mask" @click.self="editDialogVisible = false">
      <div class="dialog-box">
        <div class="dialog-title">编辑捕捞批号</div>
        <div class="form-item">
          <label class="form-label">产品批号 <span class="required">*</span></label>
          <input v-model="editForm.batchId" class="form-input" placeholder="请输入批号" />
        </div>
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input v-model="editForm.type" class="form-input" placeholder="海产品品种" />
        </div>
        <div class="form-item">
          <label class="form-label">捕捞许可证编号</label>
          <input v-model="editForm.fishLicId" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">检疫人员</label>
          <input v-model="editForm.testName" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">捕捞海域</label>
          <input v-model="editForm.seaArea" class="form-input" />
        </div>
        <div class="form-item">
          <label class="form-label">出海日期</label>
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
// 导入已经编写好的捕捞批号接口函数
import { getMyBatchList, updateFishBatch, deleteFishBatch, offShelveFishBatch } from '@/api/node/fishBatch'

// 批号列表数据
const batchList = ref([])
// 编辑弹窗显示控制
const editDialogVisible = ref(false)
// 编辑表单对象
const editForm = ref({})

/**
 * 获取状态中文文本
 * @param {Number} state 1待发布，2已发布，3已下架
 * @returns 状态文字
 */
const getStateText = (state) => {
  const map = {
    1: '待发布',
    2: '已发布',
    3: '已下架'
  }
  return map[state]
}

/**
 * 加载当前企业全部捕捞批号列表
 */
const loadBatchList = async () => {
  const res = await getMyBatchList()
  if (res.code === 200) {
    batchList.value = res.data
  }
}

/**
 * 打开编辑弹窗，回填数据
 * @param {Object} row 当前行批号对象
 */
const openEdit = (row) => {
  // 仅待发布状态允许编辑
  if (row.state !== 1) {
    ElMessage.warning('仅【待发布】状态的批号支持编辑')
    return
  }
  editForm.value = { ...row }
  editDialogVisible.value = true
}

/**
 * 提交编辑保存
 */
const submitEdit = async () => {
  if (!editForm.value.batchId) {
    ElMessage.warning('产品批号不能为空')
    return
  }
  const res = await updateFishBatch(editForm.value)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    loadBatchList()
  }
}

/**
 * 删除批号确认
 * @param {Number} fbId 主键
 */
const handleDelete = async (fbId) => {
  ElMessageBox.confirm('确认删除这条捕捞批号？删除后不可恢复', '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteFishBatch(fbId)
    ElMessage.success('删除成功')
    loadBatchList()
  }).catch(() => {})
}

/**
 * 发布上架：修改state=2
 */
const handlePublish = async (row) => {
  ElMessageBox.confirm('确认发布上架该批号？发布后不可修改', '提示').then(async () => {
    // 组装修改状态数据
    row.state = 2
    await updateFishBatch(row)
    ElMessage.success('发布上架成功')
    loadBatchList()
  })
}

/**
 * 批号下架操作
 * @param {Number} fbId 主键
 */
const handleOffShelve = async (fbId) => {
  ElMessageBox.confirm('确认下架该产品批号？', '提示').then(async () => {
    await offShelveFishBatch(fbId)
    ElMessage.success('批号已下架')
    loadBatchList()
  })
}

// 页面挂载时自动加载列表
onMounted(() => {
  loadBatchList()
})
</script>

<style scoped>
.fish-batch-list {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
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
.btn-add-wrap {
  padding:24px 30px;
}
.btn-add {
  width:100%;
  height:80px;
  background-color:#39b568;
  color:#fff;
  border-radius:16px;
  border:none;
  font-size:30px;
}
.list-wrap {
  padding:0 24px;
  flex:1;
}
.batch-card {
  border:1px solid #eee;
  border-radius:16px;
  padding:24px;
  margin-bottom:20px;
}
.card-row {
  font-size:28px;
  line-height:50px;
}
.label {
  color:#666;
}
.state-tag {
  padding:4px 12px;
  border-radius:8px;
  font-size:24px;
}
.draft {
  background:#fff3cd;
  color:#d39e00;
}
.publish {
  background:#d1e7dd;
  color:#198754;
}
.off {
  background:#f8d7da;
  color:#dc3545;
}
.btn-operation {
  display:flex;
  gap:12px;
  margin-top:20px;
}
.btn-operation button {
  flex:1;
  height:64px;
  border:none;
  border-radius:12px;
  font-size:24px;
}
.btn-edit {
  background:#cfe2ff;
  color:#084298;
}
.btn-del {
  background:#f8d7da;
  color:#b02a37;
}
.btn-publish {
  background:#d1e7dd;
  color:#0f5132;
}
.btn-off {
  background:#fff3cd;
  color:#996600;
}
.tip-text {
  color:#999;
  font-size:24px;
}
/*弹窗遮罩*/
.dialog-mask {
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.5);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:999;
}
.dialog-box {
  width:85%;
  background:#fff;
  border-radius:20px;
  padding:30px;
}
.dialog-title {
  text-align:center;
  font-size:32px;
  margin-bottom:24px;
}
.form-item {
  margin-bottom:20px;
}
.form-label {
  font-size:26px;
  display:block;
  margin-bottom:8px;
}
.required {
  color:red;
}
.form-input {
  width:100%;
  border:1px solid #ddd;
  border-radius:10px;
  padding:12px;
  font-size:26px;
}
.form-textarea {
  width:100%;
  height:100px;
  border:1px solid #ddd;
  border-radius:10px;
  padding:12px;
  font-size:26px;
}
.dialog-btn-group {
  display:flex;
  gap:16px;
  margin-top:24px;
}
.btn-cancel {
  flex:1;
  height:70px;
  border-radius:12px;
  border:1px solid #ccc;
  background:#fff;
  font-size:28px;
}
.btn-save {
  flex:1;
  height:70px;
  border-radius:12px;
  border:none;
  background:#39b568;
  color:#fff;
  font-size:28px;
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
