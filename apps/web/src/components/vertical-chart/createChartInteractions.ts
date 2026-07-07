import type * as echarts from 'echarts';
import type { TimeSeriesPoint, VerticalMetrics } from '@chart-task/shared';
import {
  makeActiveScatterValues,
  makeLinePointValues
} from './chartDataBuilders';
import type { HoverSeriesCandidate } from './chartHoverUtils';
import {
  findNearestDateIndex,
  getActivationRadius,
  isSplinePointClosest as getIsSplinePointClosest
} from './chartHoverUtils';
import {
  activePointAnimationDuration,
  splineHoverLineWidth,
  splineLineWidth
} from './chartTheme';
import { cubicOut, getPointForDate } from './chartUtils';

type ZrMouseEvent = {
  offsetX: number;
  offsetY: number;
};

type ChartInteractionsContext = {
  chart: echarts.ECharts;
  data: VerticalMetrics;
  dates: string[];
};

export const createChartInteractions = ({
  chart,
  data,
  dates
}: ChartInteractionsContext) => {
  let currentSplineLineWidth = splineLineWidth;
  let splineLineWidthAnimation: number | null = null;
  let activeDate: string | null = null;
  let isSplinePointClosest = false;

  const animateSplineLineWidth = (targetWidth: number) => {
    if (Math.abs(currentSplineLineWidth - targetWidth) < 0.01) {
      return;
    }

    if (splineLineWidthAnimation !== null) {
      cancelAnimationFrame(splineLineWidthAnimation);
      splineLineWidthAnimation = null;
    }

    const fromWidth = currentSplineLineWidth;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(
        (now - startTime) / activePointAnimationDuration,
        1
      );
      currentSplineLineWidth =
        fromWidth + (targetWidth - fromWidth) * cubicOut(progress);

      chart.setOption(
        {
          series: [
            {
              id: 'spline-line',
              animation: false,
              animationDurationUpdate: 0,
              lineStyle: {
                width: currentSplineLineWidth
              }
            }
          ]
        },
        { silent: true }
      );

      if (progress < 1) {
        splineLineWidthAnimation = requestAnimationFrame(step);
      } else {
        currentSplineLineWidth = targetWidth;
        splineLineWidthAnimation = null;
      }
    };

    splineLineWidthAnimation = requestAnimationFrame(step);
  };

  const setActiveDate = (
    date: string | null,
    nextIsSplinePointClosest = false
  ) => {
    const areaPoint = date ? getPointForDate(data.cost, date) : undefined;
    const splinePoint = date
      ? getPointForDate(data.roiConfirmed, date)
      : undefined;
    const linePoint = date
      ? getPointForDate(data.conversions, date)
      : undefined;

    chart.setOption({
      series: [
        {
          id: 'active-area-halo',
          data: areaPoint ? [[areaPoint.date, areaPoint.value]] : []
        },
        {
          id: 'active-area-point',
          data: makeActiveScatterValues(data.cost, date)
        },
        {
          id: 'active-spline-halo',
          data: splinePoint ? [[splinePoint.date, splinePoint.value]] : []
        },
        {
          id: 'active-spline-point',
          data: makeActiveScatterValues(data.roiConfirmed, date)
        },
        {
          id: 'active-line-halo',
          data: linePoint ? [[linePoint.date, linePoint.value]] : []
        },
        {
          id: 'line-points',
          data: makeLinePointValues(data.conversions, date)
        },
        {
          id: 'spline-line',
          showSymbol: !nextIsSplinePointClosest
        }
      ]
    });

    animateSplineLineWidth(
      nextIsSplinePointClosest ? splineHoverLineWidth : splineLineWidth
    );

    if (date === null) {
      chart.dispatchAction({ type: 'hideTip' });
      return;
    }

    const dataIndex = dates.indexOf(date);

    if (dataIndex >= 0) {
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex
      });
    }
  };

  const buildHoverCandidates = (
    date: string,
    offsetX: number,
    offsetY: number
  ): HoverSeriesCandidate[] =>
    [
      {
        key: 'cost' as const,
        point: getPointForDate(data.cost, date),
        yAxisIndex: 0
      },
      {
        key: 'roiConfirmed' as const,
        point: getPointForDate(data.roiConfirmed, date),
        yAxisIndex: 1
      },
      {
        key: 'conversions' as const,
        point: getPointForDate(data.conversions, date),
        yAxisIndex: 3
      }
    ]
      .filter(
        (
          item
        ): item is {
          key: HoverSeriesCandidate['key'];
          point: TimeSeriesPoint;
          yAxisIndex: number;
        } => item.point !== undefined
      )
      .map((item) => {
        const [x, y] = chart.convertToPixel(
          { xAxisIndex: 0, yAxisIndex: item.yAxisIndex },
          [item.point.date, item.point.value]
        ) as [number, number];

        return {
          key: item.key,
          distance: Math.hypot(offsetX - x, offsetY - y)
        };
      });

  const handleChartMouseMove = (event: ZrMouseEvent) => {
    const xPositions = dates.map((date) =>
      chart.convertToPixel({ xAxisIndex: 0 }, date)
    ) as number[];
    const activationRadius = getActivationRadius(xPositions);
    const nearestIndex = findNearestDateIndex(
      event.offsetX,
      xPositions,
      activationRadius
    );
    const nextDate = nearestIndex === null ? null : dates[nearestIndex];
    const nextIsSplinePointClosest =
      nextDate !== null &&
      getIsSplinePointClosest(
        buildHoverCandidates(nextDate, event.offsetX, event.offsetY)
      );

    if (
      nextDate === activeDate &&
      nextIsSplinePointClosest === isSplinePointClosest
    ) {
      return;
    }

    activeDate = nextDate;
    isSplinePointClosest = nextIsSplinePointClosest;
    setActiveDate(nextDate, nextIsSplinePointClosest);
  };

  const clearActiveDate = () => {
    if (activeDate !== null) {
      activeDate = null;
      isSplinePointClosest = false;
      setActiveDate(null);
    }
  };

  const dispose = () => {
    if (splineLineWidthAnimation !== null) {
      cancelAnimationFrame(splineLineWidthAnimation);
    }
  };

  return {
    handleChartMouseMove,
    clearActiveDate,
    dispose
  };
};
