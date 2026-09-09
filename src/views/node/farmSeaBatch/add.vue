<template>
  <!-- 养殖批号新增页面根容器，弹性布局实现顶部固定、内容滚动，底部导航吸底 -->
  <div class="farm-sea-batch-add">
    <!-- 顶部导航栏：固定定位 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()"></div>
      <div class="title">新建养殖产品批号</div>
    </div>
    <!-- 可滚动内容区域：Banner + 表单 -->
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
        <!-- 海水养殖业务产品批号（必填项） -->
        <div class="form-item">
          <label class="form-label">产品批号 <span class="required">*</span></label>
          <input
            v-model="form.batchId"
            type="text"
            class="form-input"
            placeholder="请输入海水养殖业务产品批号"
          />
        </div>
        <!-- 海产品品种 -->
        <div class="form-item">
          <label class="form-label">海产品品种</label>
          <input
            v-model="form.type"
            type="text"
            class="form-input"
            placeholder="例如：生蚝、石斑鱼、对虾"
          />
        </div>
        <!-- 水域滩涂养殖证编号 -->
        <div class="form-item">
          <label class="form-label">水域滩涂养殖证编号</label>
          <input
            v-model="form.aquaLicId"
            type="text"
            class="form-input"
            placeholder="请填写水域滩涂养殖证编号"
          />
        </div>
        <!-- 检疫人员名称 -->
        <div class="form-item">
          <label class="form-label">检疫人员名称</label>
          <input
            v-model="form.testName"
            type="text"
            class="form-input"
            placeholder="请填写检疫工作人员姓名"
          />
        </div>
        <!-- 养殖基地地址 -->
        <div class="form-item">
          <label class="form-label">养殖基地地址</label>
          <input
            v-model="form.farmAddr"
            type="text"
            class="form-input"
            placeholder="请填写具体养殖基地地址"
          />
        </div>
        <!-- 海产品出栏日期 -->
        <div class="form-item">
          <label class="form-label">海产品出栏日期</label>
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
    <!-- 底部Tab导航栏，固定吸底 -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useNodeUserStore } from '@/store/nodeUser'
import { storeToRefs } from 'pinia'

const router = useRouter()
const nodeStore = useNodeUserStore()
// 从Pinia取出当前登录企业nodeId
const { nodeId } = storeToRefs(nodeStore)

// 表单绑定对象，字段与数据库farm_sea_batch一一对应
const form = ref({
  batchId: '',
  type: '',
  aquaLicId: '',
  testName: '',
  farmAddr: '',
  batchDate: '',
  remarks: ''
})

/**
 * 提交新增养殖批号表单
 */
const handleSubmit = async () => {
  // 必填项校验：产品批号
  if (!form.value.batchId) {
    ElMessage.warning('请填写产品批号')
    return
  }
  // 校验登录企业编号是否存在
  if (!nodeId.value) {
    ElMessage.error('企业节点信息缺失，请退出账号重新登录')
    return
  }
  try {
    // 组装提交参数，携带当前登录企业nodeId
    const submitData = {
      ...form.value,
      nodeId: nodeId.value
    }
    // 请求后端新增养殖批号接口
    const res = await request.post('/node/farmSeaBatch/add', submitData)
    if (res.code === 200) {
      ElMessage.success('海水养殖产品批号创建成功')
      // 创建成功跳转到养殖批号列表页
      router.push('/node/farmSeaBatch/list')
    } else {
      ElMessage.error(res.msg || '新增批号失败')
    }
  } catch (error) {
    console.error('新增养殖批号失败：', error)
    ElMessage.error('提交失败，请检查网络或联系管理员')
  }
}
</script>

<style scoped>
/* 页面整体布局，占满全屏 */
.farm-sea-batch-add {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
/* 顶部导航栏：固定高度，不随页面滚动 */
.page-header {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 22px;
  position: relative;
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
}
/* 返回箭头图标样式 */
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
/* 滚动容器：占据剩余高度，内容超出时纵向滚动 */
.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
/* 顶部横幅banner */
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
/* 表单外层容器 */
.form-wrap {
  padding: 10px 30px 30px;
}
/* 每一行表单 */
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
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius:10px;
  font-size:18px;
  padding:16px;
  outline: none;
  box-sizing: border-box;
}
/* 提交绿色按钮 */
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
/* 底部导航栏：固定高度，不压缩不滚动 */
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
/* 底部导航图标基础尺寸 */
.icon-home,
.icon-my,
.icon-pwd {
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
/* 默认状态图标路径（public/images目录） */
.icon-home {
  background-image: url('/images/home.png');
}
.icon-my {
  background-image: url('/images/my.png');
}
.icon-pwd {
  background-image: url('/images/change.png');
}
/* active激活状态切换高亮图标 */
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
