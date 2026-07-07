import { describe, expect, test } from 'bun:test';
import type { TimeSeriesPoint } from '@chart-task/shared';
import {
  findClosestHoverSeries,
  findNearestDateIndex,
  getActivationRadius,
  isSplinePointClosest
} from './chartHoverUtils';
import {
  cubicOut,
  formatDate,
  formatValue,
  getExactMax,
  getMetricTooltipColor,
  getPaddedMax
} from './chartUtils';

const samplePoints: TimeSeriesPoint[] = [
  { date: '2026-06-10', value: 10 },
  { date: '2026-06-11', value: 50 },
  { date: '2026-06-12', value: 90 }
];

describe('chartUtils', () => {
  test('formatDate converts ISO date to DD.MM.YYYY', () => {
    expect(formatDate('2026-06-12')).toBe('12.06.2026');
  });

  test('formatValue keeps integers and formats decimals', () => {
    expect(formatValue(36)).toBe('36');
    expect(formatValue(1.23)).toBe('1.23');
  });

  test('getPaddedMax adds 8% headroom', () => {
    expect(getPaddedMax([samplePoints])).toBe(97.2);
  });

  test('getExactMax returns the highest value without padding', () => {
    expect(getExactMax(samplePoints)).toBe(90);
  });

  test('getMetricTooltipColor switches ROI color below threshold', () => {
    expect(getMetricTooltipColor('roiConfirmed', 79)).toBe('#3ac201');
    expect(getMetricTooltipColor('roiConfirmed', 120)).toBe('#1d8d22');
    expect(getMetricTooltipColor('cost', 10)).toBe('#ffe86c');
  });

  test('cubicOut eases toward 1', () => {
    expect(cubicOut(0)).toBe(0);
    expect(cubicOut(1)).toBe(1);
    expect(cubicOut(0.5)).toBeGreaterThan(0.5);
  });
});

describe('chartHoverUtils', () => {
  test('getActivationRadius uses half of the smallest x step', () => {
    expect(getActivationRadius([100, 200, 320])).toBe(50);
    expect(getActivationRadius([100])).toBe(32);
  });

  test('findNearestDateIndex returns null outside activation radius', () => {
    expect(findNearestDateIndex(50, [100, 200, 300], 40)).toBeNull();
    expect(findNearestDateIndex(205, [100, 200, 300], 40)).toBe(1);
  });

  test('findClosestHoverSeries picks the nearest candidate', () => {
    expect(
      findClosestHoverSeries([
        { key: 'cost', distance: 12 },
        { key: 'roiConfirmed', distance: 4 },
        { key: 'conversions', distance: 9 }
      ])
    ).toBe('roiConfirmed');
  });

  test('isSplinePointClosest is true only for nearest ROI point', () => {
    expect(
      isSplinePointClosest([
        { key: 'cost', distance: 4 },
        { key: 'roiConfirmed', distance: 12 }
      ])
    ).toBe(false);

    expect(
      isSplinePointClosest([
        { key: 'cost', distance: 12 },
        { key: 'roiConfirmed', distance: 4 }
      ])
    ).toBe(true);
  });
});
