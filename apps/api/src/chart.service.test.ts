import { describe, expect, test } from 'bun:test';
import { ChartService } from './chart.service';

describe('ChartService', () => {
  test('returns validated chart payload', () => {
    const service = new ChartService();
    const payload = service.getChartSeries();

    expect(payload.verticals.length).toBeGreaterThan(0);
    expect(payload.period.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(payload.verticals[0]?.metrics.cpa.length).toBeGreaterThan(0);
  });
});
