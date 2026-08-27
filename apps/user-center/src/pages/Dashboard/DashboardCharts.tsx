import { createChart, defaultBarOption, defaultPieOption, type EChartsCoreOption } from '@central-platform/charts';
import { Card, Tag } from 'antd';
import { useEffect, useRef } from 'react';

const companyOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#d68c45'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 18, right: 28, top: 12, bottom: 8, containLabel: true },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#e9edf1', type: 'dashed' } },
    axisLabel: { color: '#84909c' },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: ['星河科技', '远山零售', '北辰供应链', '云杉教育', '启明制造'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#566474', width: 110, overflow: 'truncate' },
  },
  series: [{
    name: '用户数',
    type: 'bar',
    barWidth: 16,
    data: [286, 224, 168, 132, 98],
    label: { show: true, position: 'right', color: '#566474' },
    itemStyle: { borderRadius: [2, 8, 8, 2] },
  }],
};

const statusOption: EChartsCoreOption = {
  ...defaultPieOption(),
  color: ['#2f7085', '#e4a853', '#c96852'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [{
    name: '用户状态',
    type: 'pie',
    radius: ['48%', '70%'],
    center: ['50%', '43%'],
    label: { formatter: '{b}\n{c} 人', color: '#566474' },
    itemStyle: { borderColor: '#fffdfa', borderWidth: 4, borderRadius: 8 },
    data: [
      { value: 1068, name: '正常' },
      { value: 96, name: '待激活' },
      { value: 42, name: '已停用' },
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
    <Card className="chart-card top-chart" bordered={false} title="企业用户数 TOP5" extra={<Tag>本月</Tag>}>
      <Chart option={companyOption} />
    </Card>
    <Card className="chart-card" bordered={false} title="用户状态分布">
      <Chart option={statusOption} />
    </Card>
  </>
);

export default DashboardCharts;
