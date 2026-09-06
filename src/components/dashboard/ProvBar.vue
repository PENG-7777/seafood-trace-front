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

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  renderChart(props.chartData)
}

// 渲染柱状图，适配200px紧凑高度，优化边距防止滚动条
const renderChart = (data) => {
  const xAxisData = data.map(item => item.provName)
  const seriesData = data.map(item => item.count)
  const option = {
    title: {
      text: '各省份企业数量统计',
      left: 'center',
      top: 2,
      textStyle: {
        fontSize: 18
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '8%',
      right: '4%',
      top: 40,
      bottom: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '企业数量',
      nameTextStyle: {
        fontSize: 12
      },
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '企业数',
        type: 'bar',
        data: seriesData,
        barWidth: '40%',
        itemStyle: {
          color: '#0052D4'
        }
      }
    ]
  }
  myChart.setOption(option)
}

// 监听数据变化自动刷新图表
watch(
  () => props.chartData,
  (newVal) => {
    if (myChart) {
      renderChart(newVal)
    }
  },
  { deep: true }
)

// 窗口自适应大小
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
