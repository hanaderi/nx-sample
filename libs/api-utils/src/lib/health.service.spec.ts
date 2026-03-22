import { describe, it, expect, beforeEach } from 'vitest';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService({ message: 'Hi from Test 🧪' });
  });

  it('returns status "online"', () => {
    expect(service.getStatus().status).toBe('online');
  });

  it('returns the message configured via forRoot()', () => {
    expect(service.getStatus().message).toBe('Hi from Test 🧪');
  });

  it('reflects a different message when configured differently', () => {
    const other = new HealthService({ message: 'Admin message 🔑' });
    expect(other.getStatus().message).toBe('Admin message 🔑');
  });

  it('returns a non-empty version string', () => {
    const { version } = service.getStatus();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });

  it('returns a valid ISO 8601 timestamp', () => {
    const { timestamp } = service.getStatus();
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  it('returns a fresh timestamp on every call', async () => {
    const t1 = new Date(service.getStatus().timestamp).getTime();
    await new Promise((r) => setTimeout(r, 5));
    const t2 = new Date(service.getStatus().timestamp).getTime();
    expect(t2).toBeGreaterThanOrEqual(t1);
  });
});
