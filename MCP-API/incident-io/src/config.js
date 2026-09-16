import { z } from 'zod';
const schema=z.object({INCIDENT_IO_API_KEY:z.string().min(1),INCIDENT_IO_TIMEOUT_MS:z.coerce.number().int().min(1000).max(120000).default(15000),INCIDENT_IO_MAX_RETRIES:z.coerce.number().int().min(0).max(5).default(2),INCIDENT_IO_APPROVAL_MODE:z.enum(['none','write']).default('write')});
export function loadConfig(env=process.env){return schema.parse(env)}
