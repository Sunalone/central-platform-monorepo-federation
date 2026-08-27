import { createChart, defaultBarOption, defaultPieOption, type EChartsCoreOption } from '@central-platform/charts';
import { Card, Tag } from 'antd';
import { useEffect, useRef } from 'react';

const topFiveOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#e4a853'],
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
    data: ['企业产品服务协议', '数据安全补充协议', '开放接口接入协议', '采购合作协议', '隐私政策授权书'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#566474', width: 110, overflow: 'truncate' },
  },
  series: [{
    name: '使用次数',
    type: 'bar',
    barWidth: 16,
    data: [186, 142, 98, 76, 54],
    label: { show: true, position: 'right', color: '#566474' },
    itemStyle: { borderRadius: [2, 8, 8, 2] },
  }],
};

const statusOption: EChartsCoreOption = {
  ...defaultPieOption(),
  color: ['#2f7085', '#e4a853', '#d86f52'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [{
    name: '协议状态',
    type: 'pie',
    radius: ['48%', '70%'],
    center: ['50%', '43%'],
    avoidLabelOverlap: true,
    label: { formatter: '{b}\n{c} 份', color: '#566474' },
    itemStyle: { borderColor: '#fffdfa', borderWidth: 4, borderRadius: 8 },
    data: [
      { value: 8, name: '已生效' },
      { value: 3, name: '草稿' },
      { value: 1, name: '即将到期' },
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
    <Card className="chart-card top-chart" bordered={false} title="协议被使用 TOP5" extra={<Tag>近 30 天</Tag>}>
      <Chart option={topFiveOption} />
    </Card>
    <Card className="chart-card" bordered={false} title="协议状态分布">
      <Chart option={statusOption} />
    </Card>
  </>
);

export default DashboardCharts;
