import { z } from 'zod';

export const timeSeriesPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.number()
});

export const verticalMetricsSchema = z.object({
  cost: z.array(timeSeriesPointSchema).min(1),
  roiConfirmed: z.array(timeSeriesPointSchema).min(1),
  conversions: z.array(timeSeriesPointSchema).min(1),
  cpa: z.array(timeSeriesPointSchema).min(1)
});

export const verticalKeySchema = z.enum([
  'ecommerce',
  'finance',
  'gaming',
  'travel'
]);

export const verticalDataSchema = z.object({
  id: verticalKeySchema,
  name: z.string().min(1),
  metrics: verticalMetricsSchema
});

export const verticalChartResponseSchema = z.object({
  generatedAt: z.string().datetime(),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }),
  verticals: z.array(verticalDataSchema).min(1)
});

export const parseVerticalChartResponse = (data: unknown) =>
  verticalChartResponseSchema.parse(data);

export const safeParseVerticalChartResponse = (data: unknown) =>
  verticalChartResponseSchema.safeParse(data);
