import {
  ClockCircleOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Card, Tag, Timeline, Typography } from 'antd';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { init, use as registerECharts } from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

registerECharts([BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const topFiveOption: EChartsCoreOption = {
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
  series: [
    {
      name: '使用次数',
      type: 'bar',
      barWidth: 16,
      data: [186, 142, 98, 76, 54],
      label: { show: true, position: 'right', color: '#566474' },
      itemStyle: { borderRadius: [2, 8, 8, 2] },
    },
  ],
};

const statusOption: EChartsCoreOption = {
  color: ['#2f7085', '#e4a853', '#d86f52'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [
    {
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
    },
  ],
};

interface ChartProps {
  option: EChartsCoreOption;
}

const Chart = ({ option }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return undefined;
    const chart = init(chartRef.current);
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className="dashboard-chart" />;
};

const metrics = [
  { label: '协议总数', value: 12, note: '覆盖 5 个业务域', icon: <FileProtectOutlined />, tone: 'navy' },
  { label: '已生效', value: 8, note: '本月新增 2 份', icon: <FileDoneOutlined />, tone: 'teal' },
  { label: '草稿协议', value: 3, note: '待合规审核', icon: <FileTextOutlined />, tone: 'gold' },
  { label: '即将到期', value: 1, note: '30 天内到期', icon: <ClockCircleOutlined />, tone: 'coral' },
];

const Dashboard = () => (
  <section className="dashboard-page">
    <div className="dashboard-hero">
      <div>
        <Typography.Text className="hero-kicker">PROTOCOL OVERVIEW · 2026/08/02</Typography.Text>
        <Typography.Title level={2}>协议资产，一目了然。</Typography.Title>
        <Typography.Paragraph>
          当前协议库共 12 份文件，本月累计被业务系统调用 556 次，整体运行稳定。
        </Typography.Paragraph>
      </div>
      <div className="hero-seal">
        <FileProtectOutlined />
        <span>文件校验正常</span>
      </div>
    </div>

    <div className="metric-grid">
      {metrics.map((metric) => (
        <Card key={metric.label} className="metric-card" bordered={false}>
          <div className={`metric-icon metric-${metric.tone}`}>{metric.icon}</div>
          <Typography.Text>{metric.label}</Typography.Text>
          <strong className="metric-value">{metric.value}</strong>
          <span className="metric-note">{metric.note}</span>
        </Card>
      ))}
    </div>

    <div className="dashboard-grid">
      <Card className="chart-card top-chart" bordered={false} title="协议被使用 TOP5" extra={<Tag>近 30 天</Tag>}>
        <Chart option={topFiveOption} />
      </Card>
      <Card className="chart-card" bordered={false} title="协议状态分布">
        <Chart option={statusOption} />
      </Card>
      <Card className="activity-card" bordered={false} title="最近动态">
        <Timeline
          items={[
            { color: '#2f7085', children: <><strong>企业产品服务协议</strong><span>发布 V3.2 版本 · 09:30</span></> },
            { color: '#e4a853', children: <><strong>开放接口接入协议</strong><span>进入到期提醒 · 昨天</span></> },
            { color: '#2f7085', children: <><strong>数据安全补充协议</strong><span>完成合规复核 · 08/01</span></> },
          ]}
        />
      </Card>
    </div>
  </section>
);

export default Dashboard;
