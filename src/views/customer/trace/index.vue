<template>
  <div class="trace-container">
    <!-- 顶部头部区域 -->
    <div class="trace-header">
      <div class="food-illustration"></div>
    </div>
    <!-- 主体查询区域 -->
    <div class="trace-main">
      <!-- 扫码图标圆形按钮，点击打开扫码弹窗 -->
      <div class="scan-circle" @click="openScanModal">
        <!-- 使用public下的scan.png图片替换原来css绘制图标 -->
        <img src="/images/scan.png" alt="扫码图标" class="scan-icon-img" />
        <p class="scan-text">点击扫码溯源</p>
      </div>
      <!-- 输入框 + 溯源按钮行 -->
      <div class="search-row">
        <el-input
          v-model="sourceId"
          placeholder="请输入溯源标识码"
          class="trace-input"
          size="large"
          @keyup.enter="handleQueryTrace"
        ></el-input>
        <el-button type="primary" class="trace-btn" size="large" @click="handleQueryTrace">
          溯源
        </el-button>
      </div>
    </div>
    <!-- 底部波浪背景 -->
    <div class="trace-footer"></div>
    <!-- 扫码弹窗 -->
    <div v-if="showScanModal" class="scan-modal">
      <div class="scan-modal-content">
        <!-- 关闭按钮 -->
        <div class="scan-close" @click="closeScanModal">×</div>
        <h3 class="scan-title">扫描溯源二维码</h3>
        <!-- 摄像头扫码渲染容器 -->
        <div id="qr-reader" class="qr-reader"></div>
        <!-- 选择本地图片按钮 -->
        <div class="file-select-wrap">
          <el-button type="success" @click="triggerFileSelect">选择本地图片</el-button>
          <input
            type="file"
            ref="fileInputRef"
            accept="image/*"
            style="display:none"
            @change="handleFileChange"
          />
        </div>
        <p class="scan-tip">将二维码放入框内即可自动识别，也可选择本地图片解析</p>
      </div>
    </div>
    <div id="qr-image-helper" style="display:none;"></div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { queryTraceInfo } from '@/api/publicTrace/trace'
import { ElMessage } from 'element-plus'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'

const router = useRouter()
const sourceId = ref('')
const showScanModal = ref(false)
const fileInputRef = ref(null)

// 摄像头扫码实例（弹窗内 #qr‑reader）
let qrScanner = null
// 图片解析实例，绑定全局隐藏DOM #qr‑image‑helper
let html5QrcodeImageInstance = null

/**
 * 安全清理扫码实例，避免 clear() 返回 undefined 导致 .catch 报错
 */
const safeClear = (instance) => {
  if (!instance) return
  try {
    const result = instance.clear && instance.clear()
    if (result && typeof result.catch === 'function') {
      result.catch(err => console.error('扫码器清理失败：', err))
    }
  } catch (err) {
    console.error('扫码器清理异常：', err)
  }
}

const handleQueryTrace = async () => {
  const id = sourceId.value.trim()
  if (!id) {
    ElMessage.warning('请输入溯源标识码')
    return
  }
  try {
    const res = await queryTraceInfo(id)
    if (res.code === 200) {
      ElMessage.success('溯源查询成功')
      await router.push({
        path: '/customer/trace/detail',
        query: { sourceId: id }
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

const openScanModal = () => {
  showScanModal.value = true
  setTimeout(() => {
    initQrScanner()
  }, 100)
}

const initQrScanner = () => {
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  }
  qrScanner = new Html5QrcodeScanner(
    'qr-reader',
    config,
    false
  )
  qrScanner.render(onScanSuccess, onScanError)
}

const triggerFileSelect = () => {
  fileInputRef.value && fileInputRef.value.click()
}

/**
 * 处理本地图片解析
 */
const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  try {
    if (!html5QrcodeImageInstance) {
      html5QrcodeImageInstance = new Html5Qrcode('qr-image-helper')
    }
    const decodedText = await html5QrcodeImageInstance.scanFile(file, true)
    closeScanModal()
    processScanResult(decodedText)
  } catch (err) {
    console.error('图片解析二维码失败', err)
    ElMessage.error('未能识别图片中的二维码，建议使用摄像头扫码，或更换清晰图片重试')
  } finally {
    if (e.target) {
      e.target.value = ''
    }
  }
}

const processScanResult = (decodedText) => {
  let scanSourceId = ''
  try {
    const url = new URL(decodedText)
    scanSourceId = url.searchParams.get('sourceId') || ''
  } catch (e) {
    scanSourceId = decodedText
  }
  if (!scanSourceId) {
    ElMessage.warning('未识别到有效的溯源标识码')
    return
  }
  sourceId.value = scanSourceId
  ElMessage.success('扫码成功，正在查询溯源信息')
  handleQueryTrace()
}

const onScanSuccess = (decodedText) => {
  closeScanModal()
  processScanResult(decodedText)
}

const onScanError = (error) => {
  if (error && error.name === 'NotAllowedError') {
    ElMessage.error('摄像头权限被拒绝，请在浏览器设置中开启摄像头权限')
    closeScanModal()
  }
}

const closeScanModal = () => {
  showScanModal.value = false
  safeClear(qrScanner)
  safeClear(html5QrcodeImageInstance)
  qrScanner = null
  html5QrcodeImageInstance = null
}

onBeforeUnmount(() => {
  safeClear(qrScanner)
  safeClear(html5QrcodeImageInstance)
  qrScanner = null
  html5QrcodeImageInstance = null
})
</script>

<style scoped>
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
.trace-header {
  width: 100%;
  background-image: url('/images/top.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  color: #ffffff;
  padding-top: 40px;
}
.header-title {
  font-size: 42px;
  font-weight: 500;
  margin-bottom: 12px;
}
.header-en {
  font-size: 24px;
  opacity: 0.9;
  margin: 0;
}
.food-illustration {
  margin-top: 40px;
  min-height: 200px;
}
.trace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30px;
}
.scan-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #409eff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
  box-shadow: 0 0 0 8px rgba(64, 158, 255, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.scan-circle:active {
  transform: scale(0.95);
}
/* 替换原来css绘制的图标，改为图片样式 */
.scan-icon-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 4px;
}
.scan-text {
  color: #fff;
  font-size: 12px;
  margin: 4px;
}
.search-row {
  margin-top: 20px;
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
.trace-footer {
  width: 100%;
  height: 100px;
  background-image: url('/images/bottom.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.scan-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scan-modal-content {
  width: 90%;
  max-width: 400px;
  position: relative;
}
.scan-close {
  position: absolute;
  top: -40px;
  right: 0;
  color: #fff;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
}
.scan-title {
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 20px;
}
.qr-reader {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.file-select-wrap {
  margin-top: 16px;
  text-align: center;
}
.scan-tip {
  color: #999;
  text-align: center;
  font-size: 14px;
  margin-top: 16px;
}
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
    width: 120px;
    height: 120px;
    margin-bottom: 40px;
  }
  .search-row {
    gap: 8px;
  }
  .trace-btn {
    width: 90px;
    font-size: 16px;
  }
  .trace-footer {
    height: 80px;
  }
}
@media (max-width: 640px) {
  .header-title {
    font-size: 28px;
  }
  .header-en {
    font-size: 16px;
  }
  .scan-circle {
    width: 130px;
    height: 130px;
  }
  .trace-btn {
    width: 110px;
    font-size: 18px;
  }
}
</style>
