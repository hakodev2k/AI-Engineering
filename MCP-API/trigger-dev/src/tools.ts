import { z } from 'zod';
import { batchIdSchema, runIdSchema, scheduleIdSchema, taskIdSchema } from './config.js';

const json = z.unknown();
const approved = z.boolean().default(false);
const options = z.object({
  idempotencyKey: z.string().min(1).max(256).optional(),
  concurrencyKey: z.string().min(1).max(256).optional(),
  delay: z.string().min(2).max(64).optional(),
  ttl: z.union([z.string().min(2).max(64), z.number().int().positive()]).optional(),
  tags: z.array(z.string().min(1).max(128)).max(10).optional(),
  queue: z.object({ name: z.string().min(1).max(128), concurrencyLimit: z.number().int().min(1).max(1000).optional() }).strict().optional(),
}).strict().default({});

export const schemas = {
  taskTrigger: z.object({ task: taskIdSchema, payload: json, options, approved }).strict(),
  batchTrigger: z.object({ task: taskIdSchema, items: z.array(z.object({ payload: json, options: options.optional() }).strict()).min(1).max(1000), approved }).strict(),
  runList: z.object({ limit: z.number().int().min(1).max(100).default(20), status: z.array(z.string().min(1).max(64)).max(20).optional(), taskIdentifier: z.array(taskIdSchema).max(20).optional(), tag: z.array(z.string().min(1).max(128)).max(20).optional(), after: runIdSchema.optional() }).strict(),
  runId: z.object({ runId: runIdSchema }).strict(),
  runApproved: z.object({ runId: runIdSchema, approved }).strict(),
  reschedule: z.object({ runId: runIdSchema, delay: z.string().min(2).max(64), approved }).strict(),
  batchId: z.object({ batchId: batchIdSchema }).strict(),
  scheduleList: z.object({ page: z.number().int().min(1).optional(), perPage: z.number().int().min(1).max(100).optional() }).strict(),
  scheduleId: z.object({ scheduleId: scheduleIdSchema }).strict(),
};

export function buildRunQuery(v: z.infer<typeof schemas.runList>): string {
  const q = new URLSearchParams();
  q.set('page[size]', String(v.limit));
  if (v.after) q.set('page[after]', v.after);
  if (v.status?.length) q.set('filter[status]', v.status.join(','));
  if (v.taskIdentifier?.length) q.set('filter[taskIdentifier]', v.taskIdentifier.join(','));
  if (v.tag?.length) q.set('filter[tag]', v.tag.join(','));
  return `?${q}`;
}
