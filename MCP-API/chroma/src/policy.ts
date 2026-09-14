import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ChromaConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';

export const TOOL_POLICIES: Record<string, { risk: Risk; approval: boolean }> = {
  'chroma.collection.list': { risk: 'READ', approval: false },
  'chroma.collection.get': { risk: 'READ', approval: false },
  'chroma.collection.count': { risk: 'READ', approval: false },
  'chroma.collection.peek': { risk: 'READ', approval: false },
  'chroma.document.query': { risk: 'READ', approval: false },
  'chroma.document.get': { risk: 'READ', approval: false },
  'chroma.collection.create': { risk: 'WRITE', approval: true },
  'chroma.collection.update': { risk: 'WRITE', approval: true },
  'chroma.collection.fork': { risk: 'WRITE', approval: true },
  'chroma.document.add': { risk: 'WRITE', approval: true },
  'chroma.document.update': { risk: 'WRITE', approval: true },
  'chroma.collection.delete': { risk: 'DESTRUCTIVE', approval: true },
  'chroma.document.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function approvalToken(secret: string, operation: string, resource: string): string {
  return createHmac('sha256', secret).update(`${operation}|${resource}`, 'utf8').digest('hex');
}

export function assertApproval(config: ChromaConfig, operation: string, resource: string, supplied?: string): void {
  const policy = TOOL_POLICIES[operation];
  if (!policy) throw new Error(`No policy registered for ${operation}`);
  if (policy.risk === 'READ') return;
  if (policy.risk === 'DESTRUCTIVE' && !config.enableDestructive) {
    throw new Error('Destructive Chroma tools are disabled by policy');
  }
  if (policy.risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('Approval secret is not configured');
  if (!supplied || !/^[a-f0-9]{64}$/i.test(supplied)) throw new Error('A valid approvalId is required');
  const expected = approvalToken(config.approvalSecret, operation, resource);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(supplied, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error('Approval denied');
}
