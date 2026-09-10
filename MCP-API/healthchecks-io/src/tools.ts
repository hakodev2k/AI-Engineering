import { z } from 'zod';
import type { Config } from './config.js';
import { HealthchecksClient } from './client.js';
import { requireApproval, type Risk } from './policy.js';

const approval = { approved: z.boolean().optional(), approvalToken: z.string().max(256).optional() };
const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/);
const checkFields = {
  name: z.string().min(1).max(100).optional(),
  slug: z.string().max(100).regex(/^[a-z0-9_-]*$/).optional(),
  tags: z.string().max(500).optional(),
  desc: z.string().max(10000).optional(),
  timeout: z.number().int().positive().max(31536000).optional(),
  grace: z.number().int().min(0).max(31536000).optional(),
  schedule: z.string().max(200).optional(),
  tz: z.string().max(100).optional(),
  channels: z.string().max(2000).optional()
};

export const schemas = {
  listChecks: z.object({ tag: z.string().max(100).optional(), status: z.string().max(50).optional() }).strict(),
  id: z.object({ id }).strict(),
  create: z.object({ ...checkFields, name: z.string().min(1).max(100), ...approval }).strict(),
  update: z.object({ id, ...checkFields, ...approval }).strict(),
  mutate: z.object({ id, ...approval }).strict(),
  empty: z.object({}).strict()
};

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.AnyZodObject; run: (args: any) => Promise<unknown> };

export function buildTools(client: HealthchecksClient, config: Config): ToolDef[] {
  const gated = <T extends Record<string, unknown>>(risk: Risk, fn: (args: T) => Promise<unknown>) => async (args: T) => {
    requireApproval(config, risk, args);
    const { approved: _approved, approvalToken: _approvalToken, ...providerArgs } = args as T & { approved?: boolean; approvalToken?: string };
    return fn(providerArgs as T);
  };

  return [
    { name: 'healthchecks.check.list', description: 'READ: List checks in the configured Healthchecks.io project.', risk: 'READ', schema: schemas.listChecks, run: a => client.listChecks(a) },
    { name: 'healthchecks.check.get', description: 'READ: Get one check by UUID or unique key.', risk: 'READ', schema: schemas.id, run: a => client.getCheck(a.id) },
    { name: 'healthchecks.check.create', description: 'WRITE: Create a new cron/heartbeat check. Approval is configurable.', risk: 'WRITE', schema: schemas.create, run: gated('WRITE', a => client.createCheck(a)) },
    { name: 'healthchecks.check.update', description: 'WRITE: Update one existing check. Approval is configurable.', risk: 'WRITE', schema: schemas.update, run: gated('WRITE', a => { const { id, ...body } = a; return client.updateCheck(String(id), body); }) },
    { name: 'healthchecks.check.pause', description: 'WRITE: Pause monitoring for one check. Approval is configurable.', risk: 'WRITE', schema: schemas.mutate, run: gated('WRITE', a => client.pauseCheck(String(a.id))) },
    { name: 'healthchecks.check.resume', description: 'WRITE: Resume monitoring for one check. Approval is configurable.', risk: 'WRITE', schema: schemas.mutate, run: gated('WRITE', a => client.resumeCheck(String(a.id))) },
    { name: 'healthchecks.check.delete', description: 'DESTRUCTIVE: Delete one check. Explicit approval is always required.', risk: 'DESTRUCTIVE', schema: schemas.mutate, run: gated('DESTRUCTIVE', a => client.deleteCheck(String(a.id))) },
    { name: 'healthchecks.check.flips.list', description: 'READ: List status-change history for one check.', risk: 'READ', schema: schemas.id, run: a => client.listFlips(a.id) },
    { name: 'healthchecks.integration.list', description: 'READ: List configured notification integrations; a read-write key may be required by Healthchecks.io for this endpoint.', risk: 'READ', schema: schemas.empty, run: () => client.listChannels() },
    { name: 'healthchecks.badge.list', description: 'READ: List project badge URLs and aggregate status representations.', risk: 'READ', schema: schemas.empty, run: () => client.listBadges() },
    { name: 'healthchecks.service.status', description: 'READ: Check Healthchecks.io Management API service/database connectivity.', risk: 'READ', schema: schemas.empty, run: () => client.serviceStatus() }
  ];
}
