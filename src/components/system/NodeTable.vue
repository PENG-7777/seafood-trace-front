<template>
  <div class="node-table-wrap">
    <el-table :data="tableData" border stripe style="width:100%">
      <!-- 编号列 prop 改为 nodeId -->
      <el-table-column label="编号" prop="nodeId" align="center" width="70" />
      <el-table-column label="企业名称" prop="name" align="left" />
      <el-table-column label="企业类型" prop="typeName" align="center" width="110" />
      <el-table-column label="所属省" prop="provName" align="center" width="90" />
      <el-table-column label="所属市" prop="cityName" align="center" width="90" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">详情</el-button>
          <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        :page-sizes="[5,10,20,50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
// 接收父组件传递的数据
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  pageInfo: {
    type: Object,
    required: true
  }
})
// 向上抛出事件给父页面 NodeManage.vue
const emit = defineEmits(['page-change', 'view', 'edit', 'delete'])
// 分页切换（页码/每页条数改变都触发）
const handlePageChange = () => {
  emit('page-change', props.pageInfo.pageNum)
}
// 查看详情
const handleView = (row) => {
  emit('view', row)
}
// 编辑企业
const handleEdit = (row) => {
  emit('edit', row)
}
// 删除企业（传递完整row给父组件）
const handleDelete = (row) => {
  emit('delete', row)
}
</script>
<style scoped>
.node-table-wrap {
  margin-top: 12px;
}
.pagination-box {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
