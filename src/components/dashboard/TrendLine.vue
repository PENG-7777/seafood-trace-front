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
const initChart = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  renderChart(props.chartData)
}
const renderChart = (data) => {
  const xAxisData = data.map(item => item.registerDate)
  const seriesData = data.map(item => item.count)
  const option = {
    title: { text: '企业注册数量趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: xAxisData },
    yAxis: { type: 'value', name: '新增企业数' },
    series: [{
      name: '新增数量',
      type: 'line',
      smooth: true,
      data: seriesData,
      itemStyle: { color: '#0052D4' },
      areaStyle: {
        color: {
          type: 'linear',x:0,y:0,x2:0,y2:1,
          colorStops: [{ offset:0,color:'rgba(0,82,212,0.3)'},{offset:1,color:'rgba(0,82,212,0.05)'}]
        }
      }
    }]
  }
  myChart.setOption(option)
}
watch(()=>props.chartData,newVal=>{myChart&&renderChart(newVal)},{deep:true})
const resizeHandler=()=>{myChart&&myChart.resize()}
onMounted(()=>{initChart();window.addEventListener('resize',resizeHandler)})
onBeforeUnmount(()=>{window.removeEventListener('resize',resizeHandler);myChart&&myChart.dispose()})
</script>
<style scoped>
.chart-box {width:100%;height:220px;}
</style>
