/**
 * src/utils/echarts.js
 * ECharts按需引入工具文件，减少打包体积
 * 只导入项目需要用到的图表类型与组件：折线图、饼图、柱状图、提示框、图例、网格
 */
import * as echarts from 'echarts/core'
// 引入需要的图表类型
import { LineChart, PieChart, BarChart } from 'echarts/charts'
// 引入配套组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
// 渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 注册组件与图表
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer
])

export default echarts
