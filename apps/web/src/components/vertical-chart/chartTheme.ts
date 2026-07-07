import type { MetricKey } from '@chart-task/shared';

export const metricColors: Record<MetricKey, string> = {
  cost: '#ffe86c',
  roiConfirmed: '#1d8d22',
  conversions: '#bf00e8',
  cpa: '#2f74e8'
};

export const activePointHaloSize = 44;
export const activePointInnerSize = 8;
export const activePointBorderWidth = 2.5;
export const activePointAnimationDuration = 540;
export const activePointAnimationEasing = 'cubicOut';
export const activeHaloAnimationDuration = 0;

export const linePointSymbolSize = 10;
export const linePointActiveSymbolSize = 8;
export const linePointActiveBorderWidth = activePointBorderWidth;

export const splinePointSymbolSize = 6.5;
export const splineLineWidth = splinePointSymbolSize - 0.5;
export const splineHoverLineWidth = splinePointSymbolSize / 3;

export const cpaAxisMax = 100;
export const cpaOutlineHeightOffset = 0.47;
export const cpaBarOuterWidth = 38;
export const cpaBarInnerWidth = 34;

export const splineValueThreshold = 80;
export const splineLightGreen = '#3ac201';
export const splineLineSeriesIndex = 4;

export const areaFillColor = 'rgba(255, 235, 143, 0.62)';

export const tooltipOrder: MetricKey[] = [
  'cost',
  'cpa',
  'roiConfirmed',
  'conversions'
];

export const chartGrid = {
  left: 58,
  right: 58,
  top: 42,
  bottom: 0,
  containLabel: false as const
};
