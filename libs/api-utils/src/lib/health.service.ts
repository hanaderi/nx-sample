import { Inject, Injectable } from '@nestjs/common';
import type { HealthStatusDto } from './dto/health.dto';
import { HEALTH_OPTIONS } from './health.constants';
import type { HealthModuleOptions } from './health.module';

@Injectable()
export class HealthService {
  constructor(
    @Inject(HEALTH_OPTIONS) private readonly options: HealthModuleOptions,
  ) {}

  getStatus(): HealthStatusDto {
    return {
      status: 'online',
      message: this.options.message,
      version: process.env['npm_package_version'] ?? '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
