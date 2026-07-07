import { useEffect, useMemo, useRef } from 'preact/hooks';
import * as echarts from 'echarts';
import type { VerticalMetrics } from '@chart-task/shared';
import { buildChartOption } from './buildChartOption';
import { createChartInteractions } from './createChartInteractions';
import { getExactMax, getPaddedMax } from './chartUtils';

export const useVerticalChart = (data: VerticalMetrics) => {
  const chartNodeRef = useRef<HTMLDivElement>(null);

  const dates = useMemo(
    () => data.cost.map((point) => point.date),
    [data.cost]
  );
  const costAxisMax = useMemo(() => getExactMax(data.cost), [data.cost]);
  const conversionsAxisMax = useMemo(
    () => getPaddedMax([data.conversions]),
    [data.conversions]
  );
  const roiAxisMax = useMemo(
    () => getPaddedMax([data.roiConfirmed]),
    [data.roiConfirmed]
  );

  useEffect(() => {
    if (!chartNodeRef.current) {
      return;
    }

    const chart = echarts.init(chartNodeRef.current, undefined, {
      renderer: 'canvas'
    });

    chart.setOption(
      buildChartOption(data, {
        dates,
        costAxisMax,
        roiAxisMax,
        conversionsAxisMax
      })
    );

    const interactions = createChartInteractions({ chart, data, dates });

    chart.getZr().on('mousemove', interactions.handleChartMouseMove);
    chart.getZr().on('globalout', interactions.clearActiveDate);

    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);

    return () => {
      interactions.dispose();
      chart.getZr().off('mousemove', interactions.handleChartMouseMove);
      chart.getZr().off('globalout', interactions.clearActiveDate);
      window.removeEventListener('resize', resizeChart);
      chart.dispose();
    };
  }, [conversionsAxisMax, costAxisMax, data, dates, roiAxisMax]);

  return chartNodeRef;
};
