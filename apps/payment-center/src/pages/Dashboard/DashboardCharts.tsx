import { createChart, defaultBarOption, defaultPieOption, type EChartsCoreOption } from '@central-platform/charts';
import { Card, Tag } from 'antd';
import { useEffect, useRef } from 'react';

const topProductsOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#d68c45'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 16, right: 28, top: 12, bottom: 8, containLabel: true },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#e9edf1', type: 'dashed' } },
    axisLabel: { color: '#84909c' },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: ['企业版订阅', '标准版订阅', '数据增值包', 'API 调用包', '增值服务包'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#566474', width: 110, overflow: 'truncate' },
  },
  series: [{
    name: '交易金额（元）',
    type: 'bar',
    barWidth: 16,
    data: [38600, 22400, 16800, 9200, 5800],
    label: { show: true, position: 'right', color: '#566474' },
    itemStyle: { borderRadius: [2, 8, 8, 2] },
  }],
};

const statusOption: EChartsCoreOption = {
  ...defaultPieOption(),
  color: ['#2f7085', '#e4a853', '#c96852', '#9ba8b3'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [{
    name: '支付状态',
    type: 'pie',
    radius: ['48%', '70%'],
    center: ['50%', '43%'],
    label: { formatter: '{b}\n{c} 笔', color: '#566474' },
    itemStyle: { borderColor: '#fffdfa', borderWidth: 4, borderRadius: 8 },
    data: [
      { value: 1068, name: '已支付' },
      { value: 96, name: '处理中' },
      { value: 42, name: '已退款' },
      { value: 80, name: '待支付' },
    ],
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
    <Card className="chart-card top-chart" bordered={false} title="产品交易金额 TOP5" extra={<Tag>今日</Tag>}>
      <Chart option={topProductsOption} />
    </Card>
    <Card className="chart-card" bordered={false} title="支付状态分布">
      <Chart option={statusOption} />
    </Card>
  </>
);

export default DashboardCharts;
