import {
  createChart,
  defaultBarOption,
  defaultLineOption,
  graphic,
  type EChartsCoreOption,
} from '@central-platform/charts';
import { Card, Space } from 'antd';
import { useEffect, useRef } from 'react';

const salesOption: EChartsCoreOption = {
  ...defaultLineOption(),
  color: ['#e97852'],
  tooltip: { trigger: 'axis' },
  grid: { left: 18, right: 18, top: 34, bottom: 16, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['07/27', '07/28', '07/29', '07/30', '07/31', '08/01', '08/02'],
    axisLine: { lineStyle: { color: '#dce3df' } },
    axisLabel: { color: '#7b8781' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#7b8781', formatter: '¥{value}k' },
    splitLine: { lineStyle: { color: '#edf0ee', type: 'dashed' } },
  },
  series: [{
    name: '销售额',
    type: 'line',
    smooth: true,
    symbolSize: 7,
    data: [18, 24, 21, 36, 32, 46, 52],
    lineStyle: { width: 3 },
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(233, 120, 82, 0.30)' },
        { offset: 1, color: 'rgba(233, 120, 82, 0.01)' },
      ]),
    },
  }],
};

const categoryOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#244d3c'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 18, right: 18, top: 34, bottom: 16, containLabel: true },
  xAxis: {
    type: 'category',
    data: ['电脑配件', '影音设备', '家居生活', '食品饮料', '办公用品'],
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dce3df' } },
    axisLabel: { color: '#7b8781', interval: 0 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#7b8781' },
    splitLine: { lineStyle: { color: '#edf0ee', type: 'dashed' } },
  },
  series: [{
    name: '销量',
    type: 'bar',
    barWidth: 24,
    data: [268, 192, 224, 156, 118],
    itemStyle: { borderRadius: [7, 7, 2, 2] },
  }],
};

const Chart = ({ option }: { option: EChartsCoreOption }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const controller = createChart(containerRef.current, option);
    return controller.dispose;
  }, [option]);

  return <div ref={containerRef} className="dashboard-chart" />;
};

const DashboardCharts = () => (
  <>
    <Card
      className="chart-card"
      bordered={false}
      title="近 7 日销售趋势"
      extra={<Space><span className="chart-legend coral" />销售额（千元）</Space>}
    >
      <Chart option={salesOption} />
    </Card>
    <Card
      className="chart-card"
      bordered={false}
      title="商品类目销量"
      extra={<Space><span className="chart-legend green" />销量（件）</Space>}
    >
      <Chart option={categoryOption} />
    </Card>
  </>
);

export default DashboardCharts;
