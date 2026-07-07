import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ChartService } from './chart.service.js';

@Module({
  controllers: [AppController],
  providers: [ChartService]
})
export class AppModule {}
