<template>
  <div class="search-form">
    <el-row :gutter="16" align="middle">
      <el-col :span="6">
        <el-input v-model="localForm.name" placeholder="节点企业名称" clearable></el-input>
      </el-col>
      <el-col :span="5">
        <el-select v-model="localForm.type" placeholder="企业类型" clearable style="width:100%">
          <el-option
            v-for="item in dictStore.typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="localForm.provId"
          placeholder="所属省"
          clearable
          style="width:100%"
          @change="handleProvChange"
        >
          <el-option
            v-for="p in dictStore.provinceList"
            :key="p.value"
            :label="p.label"
            :value="p.value"
          />
        </el-select>
      </el-col>
      <!-- 剩余空间放按钮，自动靠右 -->
      <el-col :span="8">
        <div class="btn-group">
          <el-button @click="handleReset">清空</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="handleAdd">新建</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDictStore } from '@/store/dict'
const dictStore = useDictStore()

const localForm = ref({
  name: '',
  type: '',
  provId: ''
})

const emit = defineEmits(['search', 'add'])

const handleQuery = () => {
  const searchParam = {
    name: localForm.value.name || null,
    type: localForm.value.type !== '' ? Number(localForm.value.type) : null,
    provId: localForm.value.provId !== '' ? Number(localForm.value.provId) : null
  }
  emit('search', searchParam)
}

const handleReset = () => {
  localForm.value = {
    name: '',
    type: '',
    provId: ''
  }
  emit('search', { name: null, type: null, provId: null })
}

const handleAdd = () => {
  emit('add')
}

const handleProvChange = () => {
  // 无城市联动逻辑，保留空函数
}
</script>

<style scoped>
.search-form {
  padding: 8px 0 16px;
}
.btn-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
