import { z } from 'zod';
const schema=z.object({LAUNCHDARKLY_API_TOKEN:z.string().min(1),LAUNCHDARKLY_API_VERSION:z.string().regex(/^\d{8}$/).default('20240415'),LAUNCHDARKLY_TIMEOUT_MS:z.coerce.number().int().min(1000).max(120000).default(15000),LAUNCHDARKLY_MAX_RETRIES:z.coerce.number().int().min(0).max(5).default(2),LAUNCHDARKLY_APPROVAL_MODE:z.enum(['none','write']).default('write')});
export function loadConfig(env=process.env){return schema.parse(env)}
