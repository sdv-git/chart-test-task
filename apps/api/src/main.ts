import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

const port = Number(process.env.PORT ?? 3001);

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter()
);

app.setGlobalPrefix('api');
app.enableCors({
  origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173'
});

await app.listen(port, '0.0.0.0');

console.log(`API is running on http://localhost:${port}/api`);
