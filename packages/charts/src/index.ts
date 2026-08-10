import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { graphic, init, use as registerEChartsModules } from 'echarts/core';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

const chartModules = [
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
];

let isRegistered = false;

/** Registers the chart modules once so each app can keep a small ECharts bundle. */
export const registerCharts = () => {
  if (isRegistered) return;
  registerEChartsModules(chartModules);
  isRegistered = true;
};

export interface ChartController {
  chart: EChartsType;
  update: (option: EChartsCoreOption) => void;
  resize: () => void;
  dispose: () => void;
}

export interface CreateChartOptions {
  theme?: string | object;
  initOptions?: Parameters<typeof init>[2];
}

/** Creates an ECharts instance with shared resize and cleanup behavior. */
export const createChart = (
  container: HTMLElement,
  option: EChartsCoreOption = {},
  options: CreateChartOptions = {},
): ChartController => {
  registerCharts();
  const chart = init(container, options.theme, options.initOptions);
  const update = (nextOption: EChartsCoreOption) => chart.setOption(nextOption);
  update(option);
  const resize = () => chart.resize();
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize);
  observer?.observe(container);

  return {
    chart,
    update,
    resize,
    dispose: () => {
      observer?.disconnect();
      chart.dispose();
    },
  };
};

export const defaultOption: EChartsCoreOption = {
  animationDuration: 500,
  grid: { left: 18, right: 18, top: 24, bottom: 16, containLabel: true },
  tooltip: { trigger: 'axis' },
};

export const defaultLineOption = (): EChartsCoreOption => ({
  ...defaultOption,
  xAxis: { type: 'category', boundaryGap: false },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true }],
});

export const defaultBarOption = (): EChartsCoreOption => ({
  ...defaultOption,
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'bar' }],
});

export const defaultPieOption = (): EChartsCoreOption => ({
  ...defaultOption,
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle' },
  series: [{ type: 'pie', radius: ['48%', '70%'] }],
});

export { graphic };
export type { EChartsCoreOption, EChartsType };
