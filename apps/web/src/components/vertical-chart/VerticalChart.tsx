import type { VerticalMetrics } from '@chart-task/shared';
import { useVerticalChart } from './useVerticalChart';

type VerticalChartProps = {
  data: VerticalMetrics;
};

export function VerticalChart({ data }: VerticalChartProps) {
  const chartNodeRef = useVerticalChart(data);

  return <div ref={chartNodeRef} className="vertical-chart" />;
}
