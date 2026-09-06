<template>
  <!-- 捕捞批号新增页面根容器，弹性布局实现底部导航自动吸底 -->
  <div class="fish-batch-add">
    <!-- 顶部导航栏：返回按钮 + 居中标题 + 右侧占位 -->
    <div class="page-header">
      <div class="back-icon" @click="$router.back()">&lt;</div>
      <div class="title">捕捞企业新建产品批号</div>
      <div class="placeholder"></div>
    </div>
    <!-- 顶部业务宣传Banner -->
    <div class="banner-block">
      <div class="banner-text">
        <h1>食材溯源</h1>
        <p>源头追溯 保障食品安全</p>
      </div>
    </div>
    <!-- 表单主体区域 -->
    <div class="form-wrap">
      <!-- 捕捞业务产品批号（必填项） -->
      <div class="form-item">
        <label class="form-label">产品批号 <span class="required">*</span></label>
        <input
          v-model="form.batchId"
          type="text"
          class="form-input"
          placeholder="请输入捕捞业务产品批号"
        />
      </div>
      <!-- 海产品品种 -->
      <div class="form-item">
        <label class="form-label">海产品品种</label>
        <input
          v-model="form.type"
          type="text"
          class="form-input"
          placeholder="例如：带鱼、三文鱼、虾"
        />
      </div>
      <!-- 渔业捕捞许可证编号 -->
      <div class="form-item">
        <label class="form-label">渔业捕捞许可证编号</label>
        <input
          v-model="form.fishLicId"
          type="text"
          class="form-input"
          placeholder="请填写捕捞许可证编号"
        />
      </div>
      <!-- 官方检疫人员名称 -->
      <div class="form-item">
        <label class="form-label">官方检疫人员名称</label>
        <input
          v-model="form.testName"
          type="text"
          class="form-input"
          placeholder="请填写检疫工作人员姓名"
        />
      </div>
      <!-- 捕捞海域 -->
      <div class="form-item">
        <label class="form-label">捕捞海域</label>
        <input
          v-model="form.seaArea"
          type="text"
          class="form-input"
          placeholder="请填写具体捕捞海域"
        />
      </div>
      <!-- 捕捞出海日期 -->
      <div class="form-item">
        <label class="form-label">捕捞出海日期</label>
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
    <!-- 底部Tab导航栏，增加图标支持激活切换 -->
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
// 请求工具类，封装axios统一请求拦截
import request from '@/utils/request'
// 获取登录企业用户信息，用于读取nodeId
import { useNodeUserStore } from '@/store/nodeUser'

// 路由实例
const router = useRouter()
// 流通节点Pinia仓库对象
const nodeStore = useNodeUserStore()

// 表单对象，字段严格对应后端fish_batch数据库表结构
const form = ref({
  batchId: '',     // 捕捞企业业务产品批号（必填）
  type: '',        // 海产品品种
  fishLicId: '',   // 渔业捕捞许可证编号
  testName: '',    // 官方检疫人员名称
  seaArea: '',     // 捕捞海域
  batchDate: '',   // 捕捞出海日期
  remarks: ''      // 备注信息
})

/**
 * 表单提交保存捕捞批号
 * 修复点：使用可选链+空对象兜底，防止userInfo为undefined读取nodeId时报错
 */
const handleSubmit = async () => {
  // 前端非空校验：产品批号为必填项
  if (!form.value.batchId) {
    ElMessage.warning('请填写产品批号')
    return
  }

  // 兜底处理，避免userInfo为undefined导致页面报错
  const userInfo = nodeStore.userInfo ?? {}
  // 判断企业节点ID是否存在，缺失则提示重新登录
  if (!userInfo.nodeId) {
    ElMessage.error('企业节点信息缺失，请退出账号重新登录')
    return
  }

  try {
    // 组装后端接口提交参数，合并表单数据与当前登录企业nodeId
    const submitData = {
      ...form.value,
      nodeId: userInfo.nodeId
    }
    // 调用后端新增捕捞批号接口
    const res = await request.post('/node/fishBatch/add', submitData)
    if (res.code === 200) {
      ElMessage.success('捕捞产品批号创建成功')
      // 创建成功后跳转到捕捞批号管理列表页面
      router.push('/node/fishBatch/list')
    }
  } catch (error) {
    console.error('新增捕捞批号失败：', error)
    ElMessage.error('提交失败，请检查网络或联系管理员')
  }
}
</script>

<style scoped>
/* 页面全局布局：弹性纵向布局，最小高度铺满屏幕，底部导航自动吸底 */
.fish-batch-add {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部标题栏三栏布局，标题绝对居中 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: clamp(44px,10vh,80px);
  padding: 0 20px;
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}

/* 返回箭头样式 */
.back-icon {
  font-size: clamp(24px,6vw,36px);
  color: #333;
  cursor: pointer;
  z-index: 2;
}

/* 页面居中标题 */
.title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: clamp(18px,5vw,32px);
  color: #333;
}

/* 右侧空白占位，用来平衡布局，保证标题居中 */
.placeholder {
  width: clamp(24px,6vw,36px);
}

/* 顶部横幅banner区域，自适应移动端高度 */
.banner-block {
  height: clamp(180px,30vh,240px);
  background: #48bc70 url('@/assets/banner-food.png') no-repeat right center;
  background-size: contain;
  padding: 20px 20px;
  box-sizing: border-box;
}

.banner-text h1 {
  font-size: clamp(32px,10vw,60px);
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
  font-size: clamp(14px,4vw,18px);
}

/* 表单外层容器，弹性占满剩余空间 */
.form-wrap {
  padding: 30px 20px;
  flex: 1;
  box-sizing: border-box;
}

/* 单个表单项间距 */
.form-item {
  margin-bottom: clamp(24px,5vw,36px);
}

/* 表单标签文字样式 */
.form-label {
  font-size: clamp(18px,5vw,30px);
  color: #666;
  display: block;
  margin-bottom:12px;
}

/* 必填项红色星号 */
.required {
  color: red;
}

/* 单行输入框样式，底部边框简约风格 */
.form-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #eeeeee;
  font-size: clamp(20px,5vw,32px);
  padding:12px 0;
  outline: none;
  box-sizing: border-box;
}

/* 多行文本域样式 */
.form-textarea {
  width: 100%;
  border: 2px solid #eee;
  border-radius:10px;
  font-size: clamp(18px,5vw,30px);
  padding:16px;
  outline: none;
  box-sizing: border-box;
}

/* 提交按钮样式，圆角绿色主色调 */
.btn-submit {
  width: 100%;
  height: clamp(60px,12vh,90px);
  background-color: #39b568;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: clamp(20px,5vw,34px);
  margin-top: 20px;
}

/* 底部导航栏，固定吸底，横向均分 */
.tab-bar {
  display: flex;
  justify-content: space-around;
  height: clamp(70px,15vh,120px);
  align-items: center;
  border-top:1px solid #eee;
  box-sizing: border-box;
}

/* 导航子项：图标+文字垂直排列 */
.tab-item {
  display:flex;
  flex-direction:column;
  align-items:center;
  font-size: clamp(14px,4vw,24px);
  color:#999;
  gap:6px;
  cursor: pointer;
}

/* 底部导航图标基础尺寸 */
.icon-home,
.icon-my,
.icon-pwd {
  width: clamp(32px,8vw,48px);
  height: clamp(32px,8vw,48px);
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

/* 当前激活tab文字高亮颜色 */
.tab-item.active {
  color:#0052D4;
}
</style>
