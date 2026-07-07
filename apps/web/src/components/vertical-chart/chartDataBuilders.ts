import type { TimeSeriesPoint } from '@chart-task/shared';
import {
  activePointInnerSize,
  linePointActiveBorderWidth,
  linePointActiveSymbolSize,
  linePointSymbolSize,
  metricColors
} from './chartTheme';

export const makeSeriesValues = (points: TimeSeriesPoint[]) =>
  points.map((point) => point.value);

export const makeLinePointValues = (
  points: TimeSeriesPoint[],
  activeDate: string | null = null
) =>
  points.map((point) => {
    const isActive = point.date === activeDate;

    return {
      value: [point.date, point.value],
      symbolSize: isActive ? linePointActiveSymbolSize : linePointSymbolSize,
      itemStyle: {
        color: metricColors.conversions,
        borderColor: '#ffffff',
        borderWidth: isActive ? linePointActiveBorderWidth : 0
      }
    };
  });

export const makeScatterValues = (points: TimeSeriesPoint[]) =>
  points.map((point) => [point.date, point.value]);

export const makeActiveScatterValues = (
  points: TimeSeriesPoint[],
  activeDate: string | null = null
) =>
  points.map((point) => ({
    value: [point.date, point.value],
    symbolSize: point.date === activeDate ? activePointInnerSize : 1,
    itemStyle: {
      opacity: point.date === activeDate ? 1 : 0
    }
  }));
