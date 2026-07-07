import { Injectable } from '@nestjs/common';
import {
  parseVerticalChartResponse,
  verticalChartResponse,
  type VerticalChartResponse
} from '@chart-task/shared';

@Injectable()
export class ChartService {
  getChartSeries(): VerticalChartResponse {
    return parseVerticalChartResponse(verticalChartResponse);
  }
}
