<template>
  <div class="page-container">
    <div class="page-title">冷冻海产品溯源平台节点管理</div>
    <el-row :gutter="10" class="content-row">
      <!-- 左侧：表格区域 -->
      <el-col :span="13">
        <el-card shadow="hover">
          <!-- 搜索栏：新增企业状态筛选 -->
          <el-form :inline="true" :model="searchParams" class="search-form">
            <el-form-item label="企业名称">
              <el-input v-model="searchParams.name" placeholder="请输入企业名称" clearable style="width: 180px" />
            </el-form-item>
            <el-form-item label="企业类型">
              <el-select v-model="searchParams.type" placeholder="请选择" clearable style="width: 140px">
                <el-option v-for="item in dictStore.typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属省份">
              <el-select v-model="searchParams.provId" placeholder="请选择" clearable style="width: 140px" @change="onSearchProvinceChange">
                <el-option v-for="p in dictStore.provinceList" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="注册状态">
              <el-select v-model="searchParams.status" placeholder="请选择" clearable style="width: 140px">
                <el-option label="待审核" :value="1" />
                <el-option label="已通过" :value="2" />
                <el-option label="禁用" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
              <el-button type="success" @click="openAddDialog">新增企业</el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <!-- 表格：新增审核通过、禁用操作按钮事件 -->
          <NodeTable
            :table-data="tableData"
            :page-info="pageInfo"
            @page-change="handlePageChange"
            @view="openDetailDialog"
            @edit="openEditDialog"
            @delete="handleDelete"
            @pass="handlePass"
            @disable="handleDisable"
          />
        </el-card>
      </el-col>

      <!-- 右侧：统计看板区域 -->
      <el-col :span="11">
        <!-- 折线图：注册趋势 -->
        <el-card shadow="hover" class="chart-card chart‑line">
          <TrendLine :chart-data="dashboardData.registerTrend" />
        </el-card>
        <!-- 双饼图一行并排 -->
        <el-row :gutter="10" class="pie‑row">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card chart‑pie">
              <ProvPie :chart-data="dashboardData.provDistribution" />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card chart‑pie">
              <TypePie :chart-data="dashboardData.typeDistribution" />
            </el-card>
          </el-col>
        </el-row>
        <!-- 柱状图：省份数量 -->
        <el-card shadow="hover" class="chart-card chart‑bar">
          <ProvBar :chart-data="dashboardData.provStats" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editDialogTitle" width="720px">
      <el-form ref="nodeFormRef" :model="editFormData" :rules="formRules" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="登录编码" prop="code">
              <el-input v-model="editFormData.code" placeholder="流通端账号编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="editFormData.name" placeholder="请输入企业名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="企业类型" prop="type">
              <el-select v-model="editFormData.type" placeholder="请选择" style="width:100%" @change="handleTypeChange">
                <el-option v-for="item in dictStore.typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册状态" prop="status">
              <el-select v-model="editFormData.status" placeholder="请选择" style="width:100%">
                <el-option label="待审核" :value="1" />
                <el-option label="已通过" :value="2" />
                <el-option label="禁用" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="注册日期" prop="regDate">
              <el-date-picker
                v-model="editFormData.regDate"
                type="date"
                placeholder="选择注册日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属省份" prop="provId">
              <el-select v-model="editFormData.provId" placeholder="请选择" style="width:100%" @change="onProvinceChange($event)">
                <el-option v-for="p in dictStore.provinceList" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="所属城市" prop="cityId">
              <el-select v-model="editFormData.cityId" placeholder="请选择" style="width:100%">
                <el-option v-for="c in dictStore.cityList" :key="c.value" :label="c.label" :value="c.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editFormData.address" placeholder="企业详细地址"></el-input>
        </el-form-item>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="营业执照编号" prop="businessId">
              <el-input v-model="editFormData.businessId"></el-input>
            </el-form-item>
          </el-col>
          <!-- 捕捞企业type=1才展示 -->
          <el-col :span="12" v-if="editFormData.type === 1">
            <el-form-item label="捕捞许可证" prop="fishingLic">
              <el-input v-model="editFormData.fishingLic"></el-input>
            </el-form-item>
          </el-col>
          <!-- 养殖企业type=2才展示 -->
          <el-col :span="12" v-if="editFormData.type === 2">
            <el-form-item label="养殖证编号" prop="aquacultureLic">
              <el-input v-model="editFormData.aquacultureLic"></el-input>
            </el-form-item>
          </el-col>
          <!-- 加工/批发/零售 type=3,4,5 -->
          <el-col :span="12" v-if="[3,4,5].includes(editFormData.type)">
            <el-form-item label="食品经营许可证" prop="foodBusinessLic">
              <el-input v-model="editFormData.foodBusinessLic"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <!-- 空占位，防止布局错乱 -->
          <el-col :span="12" v-if="editFormData.type === 1"></el-col>
          <el-col :span="12" v-if="editFormData.type === 2"></el-col>
          <el-col :span="12" v-if="[3,4,5].includes(editFormData.type)"></el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人" prop="corporation">
              <el-input v-model="editFormData.corporation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="editFormData.telephone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="editFormData.remarks" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="企业详情" width="720px">
      <div class="detail-container">
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">登录编码：</span>
              <span class="detail-value">{{ detailFormData.code || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">企业名称：</span>
              <span class="detail-value">{{ detailFormData.name || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">企业类型：</span>
              <span class="detail-value">{{ getTypeName(detailFormData.type) || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">注册状态：</span>
              <span class="detail-value">{{ getStatusName(detailFormData.status) || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">注册日期：</span>
              <span class="detail-value">{{ detailFormData.regDate || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">所属省份：</span>
              <span class="detail-value">{{ getProvName(detailFormData.provId) || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">所属城市：</span>
              <span class="detail-value">{{ getCityName(detailFormData.cityId) || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <div class="detail-item">
          <span class="detail-label">详细地址：</span>
          <span class="detail-value">{{ detailFormData.address || '-' }}</span>
        </div>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">营业执照编号：</span>
              <span class="detail-value">{{ detailFormData.businessId || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">捕捞许可证：</span>
              <span class="detail-value">{{ detailFormData.fishingLic || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">养殖证编号：</span>
              <span class="detail-value">{{ detailFormData.aquacultureLic || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">食品经营许可证：</span>
              <span class="detail-value">{{ detailFormData.foodBusinessLic || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">法定代表人：</span>
              <span class="detail-value">{{ detailFormData.corporation || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">联系电话：</span>
              <span class="detail-value">{{ detailFormData.telephone || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <div class="detail-item">
          <span class="detail-label">备注：</span>
          <span class="detail-value">{{ detailFormData.remarks || '-' }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import NodeTable from '@/components/system/NodeTable.vue'
import TrendLine from '@/components/dashboard/TrendLine.vue'
import ProvPie from '@/components/dashboard/ProvPie.vue'
import TypePie from '@/components/dashboard/TypePie.vue'
import ProvBar from '@/components/dashboard/ProvBar.vue'
import { getNodePage, saveNode, deleteNode, getNodeDetail, updateNodeStatus } from '@/api/admin/node'
import { getDashboardStats } from '@/api/admin/stats'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
const nodeFormRef = ref(null)

// 表格数据与分页
const tableData = ref([])
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 搜索参数（新增status状态筛选）
const searchParams = ref({
  name: '',
  type: '',
  provId: '',
  status: ''
})

// 看板数据
const dashboardData = ref({
  registerTrend: [],
  provDistribution: [],
  typeDistribution: [],
  provStats: []
})

// 编辑弹窗
const editDialogVisible = ref(false)
const isAddMode = ref(true)
const editDialogTitle = computed(() => isAddMode.value ? '新增企业' : '编辑企业')
const editFormData = ref({
  nodeId: null,
  code: '',
  name: '',
  type: null,
  provId: null,
  cityId: null,
  address: '',
  businessId: '',
  fishingLic: '',
  aquacultureLic: '',
  foodBusinessLic: '',
  corporation: '',
  telephone: '',
  regDate: '',
  status: null,
  remarks: ''
})

// 动态表单校验规则
const baseRules = {
  code: [{ required: true, message: '登录编码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
  provId: [{ required: true, message: '请选择省份', trigger: 'change' }],
  cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
  businessId: [{ required: true, message: '营业执照编号不能为空', trigger: 'blur' }],
  corporation: [{ required: true, message: '法定代表人不能为空', trigger: 'blur' }],
  telephone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
}
const formRules = ref({ ...baseRules })

// 根据企业类型动态更新校验规则
const refreshRules = () => {
  const type = editFormData.value.type
  formRules.value = { ...baseRules }
  if (type === 1) {
    formRules.value.fishingLic = [{ required: true, message: '捕捞许可证不能为空', trigger: 'blur' }]
    delete formRules.value.aquacultureLic
    delete formRules.value.foodBusinessLic
  } else if (type === 2) {
    formRules.value.aquacultureLic = [{ required: true, message: '养殖证编号不能为空', trigger: 'blur' }]
    delete formRules.value.fishingLic
    delete formRules.value.foodBusinessLic
  } else if ([3, 4, 5].includes(type)) {
    formRules.value.foodBusinessLic = [{ required: true, message: '食品经营许可证不能为空', trigger: 'blur' }]
    delete formRules.value.fishingLic
    delete formRules.value.aquacultureLic
  } else {
    delete formRules.value.fishingLic
    delete formRules.value.aquacultureLic
    delete formRules.value.foodBusinessLic
  }
}

// 切换企业类型触发规则刷新
const handleTypeChange = () => {
  refreshRules()
  // 清空其他证书的值
  editFormData.value.fishingLic = ''
  editFormData.value.aquacultureLic = ''
  editFormData.value.foodBusinessLic = ''
  nodeFormRef.value?.clearValidate()
}

// 详情弹窗
const detailDialogVisible = ref(false)
const detailFormData = ref({
  nodeId: null,
  code: '',
  name: '',
  type: null,
  provId: null,
  cityId: null,
  address: '',
  businessId: '',
  fishingLic: '',
  aquacultureLic: '',
  foodBusinessLic: '',
  corporation: '',
  telephone: '',
  regDate: '',
  status: null,
  remarks: ''
})

// 字典翻译方法
const getTypeName = (value) => {
  const item = dictStore.typeList.find(i => i.value === value)
  return item ? item.label : ''
}
const getProvName = (value) => {
  const item = dictStore.provinceList.find(i => i.value === value)
  return item ? item.label : ''
}
const getCityName = (value) => {
  const item = dictStore.cityList.find(i => i.value === value)
  return item ? item.label : ''
}
// 注册状态中文翻译
const getStatusName = (value) => {
  const statusMap = { 1: '待审核', 2: '已通过', 3: '禁用' }
  return statusMap[value] || '未知'
}

// 加载表格数据
const loadTableData = async () => {
  const params = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    ...searchParams.value
  }
  const res = await getNodePage(params)
  if (res.code === 200) {
    tableData.value = res.data.records
    pageInfo.value.total = res.data.total
  }
}

// 加载看板数据
const loadDashboard = async () => {
  const res = await getDashboardStats()
  if (res.code === 200) {
    dashboardData.value = res.data
  }
}

// 搜索
const handleSearch = () => {
  pageInfo.value.pageNum = 1
  loadTableData()
}

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    name: '',
    type: '',
    provId: '',
    status: ''
  }
  pageInfo.value.pageNum = 1
  loadTableData()
}

// 分页切换
const handlePageChange = (page) => {
  pageInfo.value.pageNum = page
  loadTableData()
}

// 打开新增弹窗
const openAddDialog = () => {
  isAddMode.value = true
  editFormData.value = {
    nodeId: null,
    code: '',
    name: '',
    type: null,
    provId: null,
    cityId: null,
    address: '',
    businessId: '',
    fishingLic: '',
    aquacultureLic: '',
    foodBusinessLic: '',
    corporation: '',
    telephone: '',
    regDate: '',
    status: null,
    remarks: ''
  }
  dictStore.setCityList([])
  refreshRules()
  editDialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = async (row) => {
  isAddMode.value = false
  if (!row.nodeId) {
    ElMessage.warning('该行数据主键为空，无法获取详情')
    return
  }
  const res = await getNodeDetail(row.nodeId)
  if (res.code === 200) {
    const vo = res.data
    editFormData.value = {
      nodeId: vo.nodeId,
      code: vo.code,
      name: vo.name,
      type: vo.type,
      provId: vo.provId,
      cityId: vo.cityId,
      address: vo.address,
      businessId: vo.businessId,
      fishingLic: vo.fishingLic,
      aquacultureLic: vo.aquacultureLic,
      foodBusinessLic: vo.foodBusinessLic,
      corporation: vo.corporation,
      telephone: vo.telephone,
      regDate: vo.regDate ? vo.regDate : '',
      status: vo.status,
      remarks: vo.remarks
    }
    if (editFormData.value.provId) {
      await dictStore.loadCityList(editFormData.value.provId)
    }
    refreshRules()
    editDialogVisible.value = true
  }
}

// 打开详情弹窗
const openDetailDialog = async (row) => {
  if (!row.nodeId) {
    ElMessage.warning('该行数据主键为空，无法获取详情')
    return
  }
  const res = await getNodeDetail(row.nodeId)
  if (res.code === 200) {
    const vo = res.data
    detailFormData.value = {
      nodeId: vo.nodeId,
      code: vo.code,
      name: vo.name,
      type: vo.type,
      provId: vo.provId,
      cityId: vo.cityId,
      address: vo.address,
      businessId: vo.businessId,
      fishingLic: vo.fishingLic,
      aquacultureLic: vo.aquacultureLic,
      foodBusinessLic: vo.foodBusinessLic,
      corporation: vo.corporation,
      telephone: vo.telephone,
      regDate: vo.regDate ? vo.regDate : '',
      status: vo.status,
      remarks: vo.remarks
    }
    if (detailFormData.value.provId) {
      await dictStore.loadCityList(detailFormData.value.provId)
    }
    detailDialogVisible.value = true
  }
}

// 提交表单
const submitForm = async () => {
  try {
    await nodeFormRef.value.validate()
    const submitData = JSON.parse(JSON.stringify(editFormData.value))
    submitData.type = submitData.type ? Number(submitData.type) : null
    submitData.provId = submitData.provId ? Number(submitData.provId) : null
    submitData.cityId = submitData.cityId ? Number(submitData.cityId) : null
    submitData.status = submitData.status ? Number(submitData.status) : null
    
    const nullableList = ['fishingLic','aquacultureLic','foodBusinessLic','address','remarks']
    nullableList.forEach(field => {
      if (submitData[field] === '') submitData[field] = null
    })
    
    const res = await saveNode(submitData)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      loadTableData()
      loadDashboard()
    }
  } catch (err) {
    console.error('提交异常', err)
  }
}

// 删除企业
const handleDelete = async (row) => {
  if (!row.nodeId) {
    ElMessage.warning('该行数据主键为空，无法删除')
    return
  }
  await ElMessageBox.confirm('确认删除该企业？', '提示')
  const res = await deleteNode(row.nodeId)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    loadTableData()
    loadDashboard()
  }
}

// 审核通过企业
const handlePass = async (row) => {
  if (!row.nodeId) {
    ElMessage.warning('该行数据主键为空，无法审核')
    return
  }
  if (row.status === 2) {
    ElMessage.info('该企业已为审核通过状态')
    return
  }
  await ElMessageBox.confirm('确认将该企业审核通过？', '审核确认')
  const res = await updateNodeStatus(row.nodeId, 2)
  if (res.code === 200) {
    ElMessage.success('审核通过成功')
    loadTableData()
    loadDashboard()
  }
}

// 禁用企业
const handleDisable = async (row) => {
  if (!row.nodeId) {
    ElMessage.warning('该行数据主键为空，无法禁用')
    return
  }
  if (row.status === 3) {
    ElMessage.info('该企业已为禁用状态')
    return
  }
  await ElMessageBox.confirm('确认禁用该企业？禁用后企业将无法登录系统', '禁用确认', { type: 'warning' })
  const res = await updateNodeStatus(row.nodeId, 3)
  if (res.code === 200) {
    ElMessage.success('禁用成功')
    loadTableData()
    loadDashboard()
  }
}

// 省份切换联动城市（编辑弹窗）
const onProvinceChange = async (provId) => {
  editFormData.value.cityId = null
  await dictStore.loadCityList(provId)
}

// 搜索栏省份切换
const onSearchProvinceChange = () => {
  searchParams.value.cityId = ''
}

onMounted(async () => {
  await dictStore.initDict()
  loadTableData()
  loadDashboard()
})
</script>

<style scoped>
.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-left: 20px;
}
.page-container {
  padding: 8px;
}
.content-row {
  margin-top: 8px;
}
.search-form {
  margin-bottom: 0;
}
/* 区分不同图表高度，整体压缩 */
:deep(.chart‑line .el-card__body) {
  padding: 2px !important;
}
:deep(.chart‑pie .el-card__body) {
  padding: 2px !important;
}
:deep(.chart‑bar .el-card__body) {
  padding: 2px !important;
}
.detail-container {
  line-height: 36px;
}
.detail-item {
  display: flex;
  margin-bottom: 4px;
}
.detail-label {
  width: 120px;
  color: #606266;
  flex-shrink: 0;
}
.detail-value {
  color: #303133;
}

.el-divider{
  margin-top: 4px ;
  margin-bottom: 20px;
}
</style>
