# Vertical Chart Test Task

## Demo


https://github.com/user-attachments/assets/f75f4bc1-8025-45f5-8bb5-9195d41d10e9




Fullstack demo for a vertical metrics chart. The API returns time-series data
per vertical with four business metrics:

- `cost`
- `roiConfirmed`
- `conversions`
- `cpa`

Stack: Bun, Turborepo, NestJS, Preact, Vite, Apache ECharts.

## Requirements

- Bun
- Node.js-compatible environment

## Install

```bash
bun install
```

## Run

Start the NestJS API and Preact app together:

```bash
bun dev
```

Open:

```text
http://localhost:5173
```

API endpoint:

```text
http://localhost:3001/api/chart-series
```

You can also run apps separately:

```bash
bun dev:api
bun dev:web
```

## Build

```bash
bun run build
```

## Test

```bash
bun test
```

Unit tests cover:

- Zod schemas for the API payload (`packages/shared`)
- Chart formatting and hover math (`apps/web`)
- `ChartService` validation (`apps/api`)

## Data Format

The API returns a structured payload with metadata and verticals:

```ts
type TimeSeriesPoint = {
  date: string;
  value: number;
};

type VerticalMetrics = {
  cost: TimeSeriesPoint[];
  roiConfirmed: TimeSeriesPoint[];
  conversions: TimeSeriesPoint[];
  cpa: TimeSeriesPoint[];
};

type VerticalData = {
  id: string;
  name: string;
  metrics: VerticalMetrics;
};

type VerticalChartResponse = {
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  verticals: VerticalData[];
};
```

Example:

```tsx
import { VerticalChart } from './components/VerticalChart';

const ecommerceMetrics = {
  cost: [
    { date: '2026-06-09', value: 0 },
    { date: '2026-06-10', value: 18.5 }
  ],
  roiConfirmed: [
    { date: '2026-06-09', value: 205.7 },
    { date: '2026-06-10', value: 158.1 }
  ],
  conversions: [
    { date: '2026-06-09', value: 0 },
    { date: '2026-06-10', value: 18 }
  ],
  cpa: [
    { date: '2026-06-09', value: 1.03 },
    { date: '2026-06-10', value: 1.16 }
  ]
};

export function Page() {
  return <VerticalChart data={ecommerceMetrics} />;
}
```

## Project Structure

```text
apps/
  api/      NestJS API with ChartService and Zod-validated payload
  web/      Preact + Vite UI with ECharts chart
packages/
  shared/   Shared TypeScript types, sample data, and Zod schemas
```

Chart rendering is split into focused modules under
`apps/web/src/components/vertical-chart/`:

- `chartTheme.ts` — colors and layout constants
- `chartUtils.ts` — pure formatters and axis helpers
- `chartHoverUtils.ts` — hover radius and nearest-point math
- `chartDataBuilders.ts` — ECharts series value builders
- `buildChartOption.ts` — full ECharts option assembly
- `createChartInteractions.ts` — hover, tooltip, and animation wiring
- `useVerticalChart.ts` — chart lifecycle hook

## Custom Data

There are two supported initialization paths:

1. Update `verticalChartResponse` in `packages/shared/src/index.ts`.
2. Return your own `VerticalChartResponse` object from `GET /api/chart-series`.

The web app fetches `/api/chart-series` through the Vite proxy and renders
the chart only after the payload passes Zod validation. If the API is
unavailable or returns invalid data, the chart area shows an error state.

