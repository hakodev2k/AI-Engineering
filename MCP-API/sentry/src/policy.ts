import type { ConnectorConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function requireApproval(tool: string, risk: Risk, approved: boolean | undefined, cfg: ConnectorConfig): void {
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || cfg.requireWriteApproval) {
    if (approved !== true) throw new Error(`${tool} requires explicit human approval.`);
  }
}

export function assertProjectAllowed(project: string, cfg: ConnectorConfig): string {
  const value = project.trim();
  if (!value || value.length > 255 || !/^[A-Za-z0-9._-]+$/.test(value)) throw new Error('Invalid project slug or ID.');
  if (cfg.allowedProjects.size > 0 && !cfg.allowedProjects.has(value)) throw new Error(`Project ${value} is not allowlisted.`);
  return value;
}

export function safeSegment(value: string, label: string): string {
  const v = value.trim();
  if (!v || v.length > 512 || /[\u0000-\u001f]/.test(v)) throw new Error(`Invalid ${label}.`);
  return encodeURIComponent(v);
}
