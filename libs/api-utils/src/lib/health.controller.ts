import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import type { HealthStatusDto } from './dto/health.dto.js';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** GET /api/status — used by the frontend health indicator */
  @Get('status')
  getStatus(): HealthStatusDto {
    return this.healthService.getStatus();
  }
}
