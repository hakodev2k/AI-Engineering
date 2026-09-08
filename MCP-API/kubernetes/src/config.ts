import { z } from 'zod';

const bool = (v: string | undefined) => v === 'true';
const int = (v: string | undefined, fallback: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
};

export const config = {
  kubeconfig: process.env.KUBERNETES_KUBECONFIG,
  context: process.env.KUBERNETES_CONTEXT,
  defaultNamespace: process.env.KUBERNETES_DEFAULT_NAMESPACE ?? 'default',
  timeoutMs: int(process.env.KUBERNETES_TIMEOUT_MS, 15000),
  maxRetries: Math.min(int(process.env.KUBERNETES_MAX_RETRIES, 2), 5),
  allowWrite: bool(process.env.KUBERNETES_ALLOW_WRITE),
  allowHighRisk: bool(process.env.KUBERNETES_ALLOW_HIGH_RISK),
  allowDestructive: bool(process.env.KUBERNETES_ALLOW_DESTRUCTIVE),
};

export const nameSchema = z.string().min(1).max(253).regex(/^[a-z0-9]([-a-z0-9.]*[a-z0-9])?$/i);
export const namespaceSchema = nameSchema.default(config.defaultNamespace);
export const labelSelectorSchema = z.string().max(1024).optional();
export const containerSchema = nameSchema.optional();
export const replicasSchema = z.number().int().min(0).max(10000);
export const tailLinesSchema = z.number().int().min(1).max(10000).default(200);
