import { DynamicModule, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HEALTH_OPTIONS } from './health.constants';

export interface HealthModuleOptions {
  /** Message returned by GET /api/status — configure per-app */
  message: string;
}

@Module({})
export class HealthModule {
  static forRoot(options: HealthModuleOptions): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        { provide: HEALTH_OPTIONS, useValue: options },
        HealthService,
      ],
    };
  }
}
