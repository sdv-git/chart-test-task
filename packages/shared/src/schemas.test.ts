import { describe, expect, test } from 'bun:test';
import {
  parseVerticalChartResponse,
  safeParseVerticalChartResponse,
  verticalChartResponse
} from './index.js';

describe('verticalChartResponseSchema', () => {
  test('accepts the bundled sample payload', () => {
    const parsed = parseVerticalChartResponse(verticalChartResponse);

    expect(parsed.verticals).toHaveLength(4);
    expect(parsed.verticals[0]?.metrics.cost[0]).toEqual({
      date: '2026-06-10',
      value: 2.04
    });
  });

  test('rejects payloads with invalid metric keys', () => {
    const invalid = {
      ...verticalChartResponse,
      verticals: [
        {
          id: 'ecommerce',
          name: 'E-commerce',
          metrics: {
            cost: [{ date: '2026-06-10', value: 1 }],
            roiConfirmed: [{ date: '2026-06-10', value: 1 }],
            conversions: [{ date: '2026-06-10', value: 1 }]
          }
        }
      ]
    };

    expect(safeParseVerticalChartResponse(invalid).success).toBe(false);
  });

  test('rejects invalid date format', () => {
    const invalid = {
      ...verticalChartResponse,
      period: {
        start: '06-10-2026',
        end: '2026-06-14'
      }
    };

    expect(safeParseVerticalChartResponse(invalid).success).toBe(false);
  });
});
