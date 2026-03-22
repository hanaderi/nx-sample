/** DI injection token for HealthModuleOptions — lives in its own file to avoid
 *  circular imports between health.module.ts ↔ health.service.ts */
export const HEALTH_OPTIONS = 'HEALTH_OPTIONS' as const;
