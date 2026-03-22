import { describe, it, expect, vi } from 'vitest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('returns the data from AppService', () => {
    const controller = new AppController(new AppService());
    expect(controller.getData()).toEqual({ message: 'Hello API' });
  });

  it('delegates to AppService.getData()', () => {
    const service = new AppService();
    const spy = vi.spyOn(service, 'getData');
    const controller = new AppController(service);
    controller.getData();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('returns whatever the service returns (mock)', () => {
    const service = new AppService();
    vi.spyOn(service, 'getData').mockReturnValue({ message: 'overridden' });
    const controller = new AppController(service);
    expect(controller.getData()).toEqual({ message: 'overridden' });
  });
});
