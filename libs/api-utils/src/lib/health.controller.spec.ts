import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let service: HealthService;
  let controller: HealthController;

  beforeEach(() => {
    service = new HealthService({ message: 'Controller test' });
    controller = new HealthController(service);
  });

  it('getStatus() returns a valid health payload', () => {
    const result = controller.getStatus();
    expect(result.status).toBe('online');
    expect(result.message).toBe('Controller test');
    expect(result.timestamp).toBeTruthy();
    expect(result.version).toBeTruthy();
  });

  it('delegates to HealthService.getStatus()', () => {
    const spy = vi.spyOn(service, 'getStatus');
    controller.getStatus();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('returns the value HealthService provides', () => {
    const fakePayload = {
      status: 'online' as const,
      message: 'mocked',
      version: '9.9.9',
      timestamp: '2025-01-01T00:00:00.000Z',
    };
    vi.spyOn(service, 'getStatus').mockReturnValue(fakePayload);
    expect(controller.getStatus()).toEqual(fakePayload);
  });
});
