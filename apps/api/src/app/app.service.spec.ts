import { describe, it, expect } from 'vitest';
import { AppService } from './app.service';

describe('AppService', () => {
  const service = new AppService();

  it('returns a greeting message', () => {
    expect(service.getData()).toEqual({ message: 'Hello API' });
  });

  it('returns a consistent value on repeated calls', () => {
    expect(service.getData()).toEqual(service.getData());
  });

  it('message is a non-empty string', () => {
    const { message } = service.getData();
    expect(typeof message).toBe('string');
    expect(message.length).toBeGreaterThan(0);
  });
});
