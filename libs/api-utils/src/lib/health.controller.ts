import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { HealthStatusDto } from './dto/health.dto';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** GET /api/status — used by the frontend health indicator */
  @Get('status')
  getStatus(): HealthStatusDto {
    return this.healthService.getStatus();
  }
}
