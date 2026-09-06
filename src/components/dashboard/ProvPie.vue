<template>
  <div ref="chartRef" class="chart-box"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import echarts from '@/utils/echarts'

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let myChart = null

// 初始化实例
const initChart = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  renderChart(props.chartData)
}

// 渲染省份分布饼图，标题移至左上角，压缩边距适配200px高度
const renderChart = (data) => {
  const pieData = data.map(item => ({
    name: item.provName,
    value: item.count
  }))

  const option = {
    title: {
      text: '省份企业分布',
      left: 2,
      top: 2,
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 家 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        fontSize: 8
      },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        name: '企业数量',
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['68%', '52%'],
        data: pieData
      }
    ]
  }
  myChart.setOption(option)
}

// 监听父组件数据更新，刷新饼图
watch(
  () => props.chartData,
  (newVal) => {
    if (myChart) renderChart(newVal)
  },
  { deep: true }
)

// 窗口自适应
const resizeHandler = () => {
  myChart && myChart.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  myChart && myChart.dispose()
})
</script>

<style scoped>
.chart-box {
  width: 100%;
  height: 200px;
}
</style>
