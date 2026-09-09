<template>
  <div class="trace-container">
    <!-- 顶部头部区域，使用背景图 -->
    <div class="trace-header">
      <!-- 生鲜食品插画占位区域 -->
      <div class="food-illustration"></div>
    </div>
    <!-- 主体查询区域 -->
    <div class="trace-main">
      <!-- 扫码图标圆形按钮 -->
      <div class="scan-circle">
        
      </div>
      <!-- 输入框 + 溯源按钮行 -->
      <div class="search-row">
        <el-input
          v-model="sourceId"
          placeholder="请输入溯源标识码"
          class="trace-input"
          size="large"
        ></el-input>
        <el-button type="primary" class="trace-btn" size="large" @click="handleQueryTrace">溯源</el-button>
      </div>
    </div>
    <!-- 底部波浪背景 -->
    <div class="trace-footer"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { queryTraceInfo } from '@/api/publicTrace/trace'
import { ElMessage } from 'element-plus'
const router = useRouter()
// 绑定溯源编号输入值
const sourceId = ref('')
/**
 * 点击溯源按钮触发查询操作
 * 校验输入非空，调用公开溯源接口获取全链路溯源数据
 */
const handleQueryTrace = async () => {
  const id = sourceId.value.trim()
  if (!id) {
    ElMessage.warning('请输入溯源标识码')
    return
  }
  try {
    const res = await queryTraceInfo(id)
    console.log('接口完整返回：', res)
    if (res.code === 200) {
      ElMessage.success('溯源查询成功')
      console.log('准备跳转，sourceId=', id)
      await router.push({
        path: '/customer/trace/detail',
        query: {
          sourceId: id
        }
      }).catch(err => {
        console.error('路由跳转失败：', err)
        ElMessage.error('页面跳转失败，请检查路由配置')
      })
    } else {
      ElMessage.error(res.msg || '未查询到该溯源信息')
    }
  } catch (error) {
    ElMessage.error('溯源查询接口请求失败，请检查网络或后端服务')
    console.error('溯源接口异常：', error)
  }
}
</script>
<style scoped>
/* 基础重置，适配375×667移动端设计稿 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.trace-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}
/* 顶部头部背景，public静态资源路径 /images/top.png */
.trace-header {
  width: 100%;
  background-image: url('/images/top.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  color: #ffffff;
}
.header-title {
  font-size: 42px;
  font-weight: 500;
  margin-bottom: 12px;
}
.header-en {
  font-size: 24px;
  opacity: 0.9;
}
.food-illustration {
  margin-top: 40px;
  min-height:200px;
}
.trace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30px;
}
.scan-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:40px;
  margin-bottom: 20px;
  box-shadow: 0 0 0 8px rgba(64, 158, 255, 0.15);
}
.scan-icon {
  width: 80px;
  height: 80px;
  border: 6px solid #fff;
  border-top: none;
  border-bottom: none;
  position: relative;
}
.scan-icon::before,
.scan-icon::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border: 6px solid #fff;
}
.scan-icon::before {
  top: -6px;
  left: -6px;
  border-right: none;
  border-bottom: none;
}
.scan-icon::after {
  bottom: -6px;
  right: -6px;
  border-left: none;
  border-top: none;
}
.search-row {
  margin-top:20px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  max-width: 600px;
}
.trace-input {
  flex: 1;
}
.trace-btn {
  width: 140px;
  font-size: 22px;
  white-space: nowrap;
}
/* 底部背景图路径修改为 /images/bottom.png */
.trace-footer {
  width: 100%;
  height: 100px;
  background-image: url('/images/bottom.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
/* 精准适配 iPhone6/7/8 375×667 移动端 */
@media screen and (max-width: 375px) and (max-height: 667px) {
  .trace-header {
    padding: 24px 16px 40px;
  }
  .header-title {
    font-size: 26px;
  }
  .header-en {
    font-size: 14px;
  }
  .food-illustration {
    margin-top: 20px;
    min-height: 180px;
  }
  .trace-main {
    padding: 30px 16px;
  }
  .scan-circle {
    width: 140px;
    height: 140px;
    margin-bottom: 40px;
    box-shadow: 0 0 0 16px rgba(64, 158, 255, 0.15);
  }
  .scan-icon {
    width: 80px;
    height: 80px;
    border-width: 4px;
  }
  .scan-icon::before,
  .scan-icon::after {
    width: 20px;
    height: 20px;
    border-width: 4px;
  }
  /* 小屏同样保持一行布局 */
  .search-row {
    flex-direction: row;
    gap: 8px;
  }
  .trace-btn {
    width: 80px;
    font-size: 8px;
  }
  .trace-footer {
    height: 80px;
  }
}
/* 通用小屏兜底适配 */
@media (max-width: 640px) {
  .header-title {
    font-size: 28px;
  }
  .header-en {
    font-size: 16px;
  }
  .scan-circle {
    width: 150px;
    height: 150px;
  }
  .search-row {
    flex-direction: row;
  }
  .trace-btn {
    width: 110px;
  }
}
</style>
