export type MetricKey = 'cost' | 'roiConfirmed' | 'conversions' | 'cpa';

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type VerticalMetrics = {
  cost: TimeSeriesPoint[];
  roiConfirmed: TimeSeriesPoint[];
  conversions: TimeSeriesPoint[];
  cpa: TimeSeriesPoint[];
};

export type VerticalKey = 'ecommerce' | 'finance' | 'gaming' | 'travel';

export type VerticalData = {
  id: VerticalKey;
  name: string;
  metrics: VerticalMetrics;
};

export type VerticalChartResponse = {
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  verticals: VerticalData[];
};

export type VerticalOption = {
  key: VerticalKey;
  label: string;
};

export const metricLabels: Record<MetricKey, string> = {
  cost: 'Cost',
  roiConfirmed: 'ROI confirmed',
  conversions: 'Conversions',
  cpa: 'CPA'
};

export const defaultVerticalKey: VerticalKey = 'ecommerce';

const verticalMetricsByKey: Record<VerticalKey, VerticalMetrics> = {
  ecommerce: {
    cost: [
      { date: '2026-06-10', value: 2.04 },
      { date: '2026-06-11', value: 25.85 },
      { date: '2026-06-12', value: 44.36 },
      { date: '2026-06-13', value: 55.65 },
      { date: '2026-06-14', value: 63.75 }
    ],
    roiConfirmed: [
      { date: '2026-06-10', value: 610.78 },
      { date: '2026-06-11', value: 180.5 },
      { date: '2026-06-12', value: 161.47 },
      { date: '2026-06-13', value: 56.33 },
      { date: '2026-06-14', value: 357.25 }
    ],
    conversions: [
      { date: '2026-06-10', value: 3 },
      { date: '2026-06-11', value: 30 },
      { date: '2026-06-12', value: 36 },
      { date: '2026-06-13', value: 70 },
      { date: '2026-06-14', value: 90 }
    ],
    cpa: [
      { date: '2026-06-10', value: 0.68 },
      { date: '2026-06-11', value: 0.86 },
      { date: '2026-06-12', value: 1.23 },
      { date: '2026-06-13', value: 0.79 },
      { date: '2026-06-14', value: 0.71 }
    ]
  },
  finance: {
    cost: [
      { date: '2026-06-10', value: 21.4 },
      { date: '2026-06-11', value: 33.8 },
      { date: '2026-06-12', value: 48.2 },
      { date: '2026-06-13', value: 53.7 },
      { date: '2026-06-14', value: 60.1 }
    ],
    roiConfirmed: [
      { date: '2026-06-10', value: 170.3 },
      { date: '2026-06-11', value: 166.8 },
      { date: '2026-06-12', value: 152.6 },
      { date: '2026-06-13', value: 143.2 },
      { date: '2026-06-14', value: 128.5 }
    ],
    conversions: [
      { date: '2026-06-10', value: 16 },
      { date: '2026-06-11', value: 27 },
      { date: '2026-06-12', value: 35 },
      { date: '2026-06-13', value: 47 },
      { date: '2026-06-14', value: 54 }
    ],
    cpa: [
      { date: '2026-06-10', value: 1.35 },
      { date: '2026-06-11', value: 1.28 },
      { date: '2026-06-12', value: 1.19 },
      { date: '2026-06-13', value: 1.12 },
      { date: '2026-06-14', value: 1.05 }
    ]
  },
  gaming: {
    cost: [
      { date: '2026-06-10', value: 14.1 },
      { date: '2026-06-11', value: 29.7 },
      { date: '2026-06-12', value: 36.9 },
      { date: '2026-06-13', value: 51.6 },
      { date: '2026-06-14', value: 57.4 }
    ],
    roiConfirmed: [
      { date: '2026-06-10', value: 126.8 },
      { date: '2026-06-11', value: 147.5 },
      { date: '2026-06-12', value: 169.9 },
      { date: '2026-06-13', value: 193.4 },
      { date: '2026-06-14', value: 207.2 }
    ],
    conversions: [
      { date: '2026-06-10', value: 11 },
      { date: '2026-06-11', value: 24 },
      { date: '2026-06-12', value: 32 },
      { date: '2026-06-13', value: 45 },
      { date: '2026-06-14', value: 58 }
    ],
    cpa: [
      { date: '2026-06-10', value: 0.88 },
      { date: '2026-06-11', value: 0.94 },
      { date: '2026-06-12', value: 1.01 },
      { date: '2026-06-13', value: 1.12 },
      { date: '2026-06-14', value: 1.21 }
    ]
  },
  travel: {
    cost: [
      { date: '2026-06-10', value: 9.8 },
      { date: '2026-06-11', value: 18.6 },
      { date: '2026-06-12', value: 31.4 },
      { date: '2026-06-13', value: 45.2 },
      { date: '2026-06-14', value: 55.8 }
    ],
    roiConfirmed: [
      { date: '2026-06-10', value: 204.8 },
      { date: '2026-06-11', value: 187.2 },
      { date: '2026-06-12', value: 168.4 },
      { date: '2026-06-13', value: 151.7 },
      { date: '2026-06-14', value: 132.2 }
    ],
    conversions: [
      { date: '2026-06-10', value: 7 },
      { date: '2026-06-11', value: 16 },
      { date: '2026-06-12', value: 29 },
      { date: '2026-06-13', value: 41 },
      { date: '2026-06-14', value: 56 }
    ],
    cpa: [
      { date: '2026-06-10', value: 1.24 },
      { date: '2026-06-11', value: 1.18 },
      { date: '2026-06-12', value: 1.07 },
      { date: '2026-06-13', value: 0.98 },
      { date: '2026-06-14', value: 0.92 }
    ]
  }
};

const verticalNames: Record<VerticalKey, string> = {
  ecommerce: 'E-commerce',
  finance: 'Finance',
  gaming: 'Gaming',
  travel: 'Travel'
};

export const verticalChartResponse: VerticalChartResponse = {
  generatedAt: '2026-06-14T12:00:00.000Z',
  period: {
    start: '2026-06-10',
    end: '2026-06-14'
  },
  verticals: (Object.keys(verticalMetricsByKey) as VerticalKey[]).map(
    (id) => ({
      id,
      name: verticalNames[id],
      metrics: verticalMetricsByKey[id]
    })
  )
};

export const chartVerticals: VerticalOption[] = verticalChartResponse.verticals.map(
  (vertical) => ({
    key: vertical.id,
    label: vertical.name
  })
);

export const sampleVerticalMetrics: VerticalMetrics =
  verticalMetricsByKey[defaultVerticalKey];

export {
  parseVerticalChartResponse,
  safeParseVerticalChartResponse,
  timeSeriesPointSchema,
  verticalChartResponseSchema,
  verticalDataSchema,
  verticalKeySchema,
  verticalMetricsSchema
} from './schemas.js';
