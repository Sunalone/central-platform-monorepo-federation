# @central-platform/charts

Shared ECharts registration, lifecycle helpers, and default options for the Central Platform applications.

```tsx
import { createChart, defaultLineOption, type EChartsCoreOption } from '@central-platform/charts';

const option: EChartsCoreOption = {
  ...defaultLineOption(),
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  series: [{ type: 'line', data: [12, 18, 15] }],
};

const controller = createChart(containerElement, option);
controller.update(option);
controller.dispose();
```
