import { useEffect, useRef } from 'react';
import type { EChartsCoreOption } from '../../lib/charts';
import { createChart } from '../../lib/charts';

interface TrendChartProps {
  option: EChartsCoreOption;
  label: string;
}

const TrendChart = ({ option, label }: TrendChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const controller = createChart(containerRef.current, option, {
      initOptions: { renderer: 'canvas' },
    });

    return controller.dispose;
  }, [option]);

  return <div ref={containerRef} className="trend-chart" role="img" aria-label={label} />;
};

export default TrendChart;
