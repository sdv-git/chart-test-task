import type { EChartsOption } from 'echarts';
import {
  metricLabels,
  type MetricKey,
  type VerticalMetrics
} from '@chart-task/shared';
import {
  makeActiveScatterValues,
  makeLinePointValues,
  makeScatterValues,
  makeSeriesValues
} from './chartDataBuilders';
import {
  activeHaloAnimationDuration,
  activePointAnimationDuration,
  activePointAnimationEasing,
  activePointBorderWidth,
  activePointHaloSize,
  activePointInnerSize,
  areaFillColor,
  chartGrid,
  cpaAxisMax,
  cpaBarInnerWidth,
  cpaBarOuterWidth,
  cpaOutlineHeightOffset,
  metricColors,
  splineLightGreen,
  splineLineSeriesIndex,
  splineLineWidth,
  splinePointSymbolSize,
  splineValueThreshold,
  tooltipOrder
} from './chartTheme';
import {
  formatDate,
  formatValue,
  getMetricTooltipColor
} from './chartUtils';

type CustomSeriesApi = {
  value: (index: number) => unknown;
  coord: (value: [string | number, number]) => [number, number];
};

export type ChartAxisBounds = {
  dates: string[];
  costAxisMax: number;
  roiAxisMax: number;
  conversionsAxisMax: number;
};

export const buildChartOption = (
  data: VerticalMetrics,
  bounds: ChartAxisBounds
): EChartsOption => {
  const { dates, costAxisMax, roiAxisMax, conversionsAxisMax } = bounds;

  return {
    animationDuration: 600,
    stateAnimation: {
      duration: activePointAnimationDuration,
      easing: activePointAnimationEasing
    },
    color: [
      metricColors.cost,
      metricColors.cpa,
      metricColors.roiConfirmed,
      metricColors.conversions
    ],
    grid: chartGrid,
    tooltip: {
      trigger: 'axis',
      triggerOn: 'none',
      appendToBody: true,
      backgroundColor: '#ffffff',
      borderColor: '#d6cec8',
      borderWidth: 1,
      borderRadius: 4,
      padding: [12, 14],
      extraCssText:
        'box-shadow: 0 12px 20px rgba(55, 43, 34, 0.35); font-family: Inter, Arial, sans-serif;',
      axisPointer: {
        type: 'none',
        snap: true
      },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        const date = String(
          (items[0] as { axisValue?: string } | undefined)?.axisValue ??
            dates[0]
        );

        const rows = tooltipOrder
          .map((key: MetricKey) => {
            const label = metricLabels[key];
            const value = data[key].find((point) => point.date === date)?.value;

            if (value === undefined) {
              return '';
            }

            return `<div class="chart-tooltip__row">
                <span class="chart-tooltip__dot" style="background:${getMetricTooltipColor(key, value)}"></span>
                <span>${label}: <strong>${formatValue(value)}</strong></span>
              </div>`;
          })
          .join('');

        return `<div class="chart-tooltip">
            <div class="chart-tooltip__date">${formatDate(date)}</div>
            ${rows}
          </div>`;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: costAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      {
        type: 'value',
        min: 0,
        max: roiAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      {
        type: 'value',
        min: 0,
        max: cpaAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      {
        type: 'value',
        min: 0,
        max: conversionsAxisMax,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      }
    ],
    visualMap: {
      show: false,
      type: 'piecewise',
      seriesIndex: splineLineSeriesIndex,
      dimension: 1,
      pieces: [
        {
          max: splineValueThreshold - 0.01,
          color: splineLightGreen
        },
        { min: splineValueThreshold, color: metricColors.roiConfirmed }
      ],
      outOfRange: {
        color: metricColors.roiConfirmed
      }
    },
    series: [
      {
        name: metricLabels.cost,
        type: 'line',
        data: makeSeriesValues(data.cost),
        showSymbol: false,
        smooth: false,
        lineStyle: {
          width: 0,
          opacity: 0
        },
        areaStyle: {
          opacity: 0.82,
          color: areaFillColor
        },
        itemStyle: {
          color: metricColors.cost
        },
        emphasis: {
          scale: false,
          areaStyle: {
            opacity: 0.82,
            color: areaFillColor
          }
        },
        z: 1
      },
      {
        id: 'active-area-halo',
        name: metricLabels.cost,
        type: 'scatter',
        data: [],
        symbol: 'circle',
        symbolSize: activePointHaloSize,
        silent: true,
        showSymbol: true,
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: activeHaloAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.cost,
          opacity: 0.24
        },
        emphasis: {
          disabled: true
        },
        z: 7
      },
      {
        id: 'active-area-point',
        name: metricLabels.cost,
        type: 'scatter',
        data: makeActiveScatterValues(data.cost),
        symbol: 'circle',
        symbolSize: activePointInnerSize,
        silent: true,
        showSymbol: true,
        animationDurationUpdate: activePointAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.cost,
          borderColor: '#ffffff',
          borderWidth: activePointBorderWidth
        },
        emphasis: {
          disabled: true
        },
        z: 8
      },
      {
        name: metricLabels.cpa,
        type: 'custom',
        yAxisIndex: 2,
        data: makeScatterValues(data.cpa),
        renderItem: (_params: unknown, api: CustomSeriesApi) => {
          const date = api.value(0);
          const value = Number(api.value(1));
          const centerX = api.coord([String(date), value])[0];
          const baselineY = api.coord([String(date), 0])[1];
          const outerTopY = api.coord([
            String(date),
            Math.min(cpaAxisMax, value + cpaOutlineHeightOffset)
          ])[1];
          const innerTopY = api.coord([String(date), value])[1];

          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: {
                  x: centerX - cpaBarOuterWidth / 2,
                  y: outerTopY,
                  width: cpaBarOuterWidth,
                  height: baselineY - outerTopY,
                  r: [6, 6, 0, 0]
                },
                style: {
                  fill: '#ffffff'
                }
              },
              {
                type: 'rect',
                shape: {
                  x: centerX - cpaBarInnerWidth / 2,
                  y: innerTopY,
                  width: cpaBarInnerWidth,
                  height: baselineY - innerTopY,
                  r: [5, 5, 0, 0]
                },
                style: {
                  fill: metricColors.cpa
                }
              }
            ]
          };
        },
        z: 3
      },
      {
        id: 'spline-line',
        name: metricLabels.roiConfirmed,
        type: 'line',
        yAxisIndex: 1,
        data: makeSeriesValues(data.roiConfirmed),
        smooth: 0.45,
        symbol: 'circle',
        symbolSize: splinePointSymbolSize,
        showSymbol: true,
        animationDurationUpdate: activePointAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        lineStyle: {
          opacity: 1,
          width: splineLineWidth
        },
        emphasis: {
          disabled: true
        },
        z: 4
      },
      {
        id: 'active-spline-halo',
        name: metricLabels.roiConfirmed,
        type: 'scatter',
        yAxisIndex: 1,
        data: [],
        symbol: 'circle',
        symbolSize: activePointHaloSize,
        silent: true,
        showSymbol: true,
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: activeHaloAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.roiConfirmed,
          opacity: 0.24
        },
        emphasis: {
          disabled: true
        },
        z: 7
      },
      {
        id: 'active-spline-point',
        name: metricLabels.roiConfirmed,
        type: 'scatter',
        yAxisIndex: 1,
        data: makeActiveScatterValues(data.roiConfirmed),
        symbol: 'diamond',
        symbolSize: activePointInnerSize,
        silent: true,
        showSymbol: true,
        animationDurationUpdate: activePointAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.roiConfirmed,
          borderColor: '#ffffff',
          borderWidth: activePointBorderWidth
        },
        emphasis: {
          disabled: true
        },
        z: 8
      },
      {
        id: 'line-base',
        name: metricLabels.conversions,
        type: 'line',
        yAxisIndex: 3,
        data: makeSeriesValues(data.conversions),
        symbol: 'none',
        showSymbol: false,
        lineStyle: {
          color: metricColors.conversions,
          width: 2
        },
        emphasis: {
          disabled: true
        },
        z: 5
      },
      {
        id: 'line-points',
        name: metricLabels.conversions,
        type: 'scatter',
        yAxisIndex: 3,
        data: makeLinePointValues(data.conversions),
        symbol: 'rect',
        symbolSize: 10,
        silent: true,
        animationDurationUpdate: activePointAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.conversions,
          borderColor: '#ffffff',
          borderWidth: 0
        },
        emphasis: {
          disabled: true
        },
        z: 10
      },
      {
        id: 'active-line-halo',
        name: metricLabels.conversions,
        type: 'scatter',
        yAxisIndex: 3,
        data: [],
        symbol: 'circle',
        symbolSize: activePointHaloSize,
        silent: true,
        showSymbol: true,
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: activeHaloAnimationDuration,
        animationEasingUpdate: activePointAnimationEasing,
        itemStyle: {
          color: metricColors.conversions,
          opacity: 0.24
        },
        emphasis: {
          disabled: true
        },
        z: 9
      }
    ]
  } as EChartsOption;
};
