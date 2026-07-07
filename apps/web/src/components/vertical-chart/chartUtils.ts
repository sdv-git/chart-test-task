import type { MetricKey, TimeSeriesPoint } from '@chart-task/shared';
import { metricColors, splineLightGreen, splineValueThreshold } from './chartTheme';

export const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
};

export const formatValue = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

export const getPaddedMax = (seriesGroups: TimeSeriesPoint[][]) => {
  const maxValue = Math.max(
    ...seriesGroups.flatMap((points) => points.map((point) => point.value))
  );

  return maxValue > 0 ? Number((maxValue * 1.08).toFixed(2)) : 1;
};

export const getExactMax = (points: TimeSeriesPoint[]) => {
  const maxValue = Math.max(...points.map((point) => point.value));

  return maxValue > 0 ? maxValue : 1;
};

export const getMetricTooltipColor = (key: MetricKey, value: number) => {
  if (key === 'roiConfirmed') {
    return value < splineValueThreshold
      ? splineLightGreen
      : metricColors.roiConfirmed;
  }

  return metricColors[key];
};

export const cubicOut = (progress: number) => 1 - (1 - progress) ** 3;

export const getPointForDate = (points: TimeSeriesPoint[], date: string) =>
  points.find((point) => point.date === date);
