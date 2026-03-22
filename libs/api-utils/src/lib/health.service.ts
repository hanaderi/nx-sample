import { Inject, Injectable } from '@nestjs/common';
import type { HealthStatusDto } from './dto/health.dto.js';
import { HEALTH_OPTIONS } from './health.constants.js';
import type { HealthModuleOptions } from './health.module.js';

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
