import type { EChartsCoreOption } from '../lib/charts';
import { defaultBarOption, defaultLineOption } from '../lib/charts';

const axisStyle = {
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: '#84918e', fontSize: 10 },
};

export const productCategoryOption: EChartsCoreOption = {
  ...defaultBarOption(),
  animationDuration: 380,
  color: ['#0f756b'],
  grid: { left: 4, right: 4, top: 12, bottom: 0, containLabel: true },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'category',
    data: ['理财', '保险', '信贷', '权益'],
    ...axisStyle,
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#edf1ef' } },
    ...axisStyle,
  },
  series: [
    {
      type: 'bar',
      data: [18, 12, 8, 6],
      barWidth: 18,
      itemStyle: { borderRadius: [6, 6, 2, 2] },
    },
  ],
};

export const paymentTrendOption: EChartsCoreOption = {
  ...defaultLineOption(),
  animationDuration: 380,
  color: ['#dd8b2e'],
  grid: { left: 4, right: 8, top: 12, bottom: 0, containLabel: true },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '今日'],
    ...axisStyle,
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#edf1ef' } },
    ...axisStyle,
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: [32, 41, 38, 54, 48, 63, 71],
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(221, 139, 46, 0.12)' },
    },
  ],
};

export const userGrowthOption: EChartsCoreOption = {
  ...defaultLineOption(),
  animationDuration: 380,
  color: ['#28759c'],
  grid: { left: 4, right: 8, top: 12, bottom: 0, containLabel: true },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['3 月', '4 月', '5 月', '6 月', '7 月', '8 月'],
    ...axisStyle,
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#edf1ef' } },
    ...axisStyle,
  },
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [820, 960, 1080, 1280, 1460, 1682],
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(40, 117, 156, 0.12)' },
    },
  ],
};
