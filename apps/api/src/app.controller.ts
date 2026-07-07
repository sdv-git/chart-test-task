import { Controller, Get } from '@nestjs/common';
import type { VerticalChartResponse } from '@chart-task/shared';
import { ChartService } from './chart.service.js';

@Controller()
export class AppController {
  constructor(private readonly chartService: ChartService) {}

  @Get('health')
  getHealth() {
    return { ok: true };
  }

  @Get('chart-series')
  getChartSeries(): VerticalChartResponse {
    return this.chartService.getChartSeries();
  }
}
