import { useEffect, useState } from 'preact/hooks';
import {
  defaultVerticalKey,
  safeParseVerticalChartResponse,
  type VerticalChartResponse,
  type VerticalMetrics,
  type VerticalKey,
  type VerticalOption
} from '@chart-task/shared';
import { VerticalChart } from './components/VerticalChart';

const apiUrl = import.meta.env.VITE_API_URL ?? '/api/chart-series';

type LoadState = 'loading' | 'ready' | 'error';

const applyChartResponse = (payload: VerticalChartResponse) => ({
  verticals: payload.verticals.map(
    (vertical): VerticalOption => ({
      key: vertical.id,
      label: vertical.name
    })
  ),
  metricsByVertical: Object.fromEntries(
    payload.verticals.map((vertical) => [vertical.id, vertical.metrics])
  ) as Record<VerticalKey, VerticalMetrics>
});

export function App() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] =
    useState<VerticalKey>(defaultVerticalKey);
  const [verticals, setVerticals] = useState<VerticalOption[]>([]);
  const [metricsByVertical, setMetricsByVertical] = useState<
    Partial<Record<VerticalKey, VerticalMetrics>>
  >({});

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }

        return response.json();
      })
      .then((payload) => {
        const parsed = safeParseVerticalChartResponse(payload);

        if (!parsed.success) {
          console.warn(
            'Invalid chart-series payload.',
            parsed.error.flatten()
          );
          setErrorMessage('Server returned invalid chart data.');
          setLoadState('error');
          return;
        }

        const { verticals: nextVerticals, metricsByVertical: nextMetrics } =
          applyChartResponse(parsed.data);

        setVerticals(nextVerticals);
        setMetricsByVertical(nextMetrics);
        setSelectedVertical(
          parsed.data.verticals[0]?.id ?? defaultVerticalKey
        );
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        console.warn('Failed to load chart-series.', error);
        setErrorMessage('Could not load chart data from server.');
        setLoadState('error');
      });
  }, []);

  const chartData = metricsByVertical[selectedVertical];

  return (
    <main className="page-shell">
      <section className="dashboard-card" aria-label="Vertical metrics chart">
        <aside className="today-column" aria-label="Today summary">
          <strong>Tdy</strong>
          <span>0%</span>
          <span>$0</span>
          <span>$0</span>
          <span>0</span>
          <span>0</span>
          <span>—</span>
        </aside>

        <div className="chart-panel">
          <div className="chart-frame">
            {loadState === 'ready' && chartData ? (
              <VerticalChart data={chartData} />
            ) : (
              <div className="chart-state" role="status" aria-live="polite">
                {loadState === 'loading'
                  ? 'Loading chart...'
                  : (errorMessage ?? 'Chart data is unavailable.')}
              </div>
            )}
          </div>

          {loadState === 'ready' && verticals.length > 0 ? (
            <label className="vertical-picker">
              <span>Vertical</span>
              <select
                value={selectedVertical}
                onChange={(event) => {
                  setSelectedVertical(
                    (event.currentTarget as HTMLSelectElement)
                      .value as VerticalKey
                  );
                }}
              >
                {verticals.map((vertical) => (
                  <option key={vertical.key} value={vertical.key}>
                    {vertical.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </section>
    </main>
  );
}
