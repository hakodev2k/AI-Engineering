import { describe,expect,it,vi } from 'vitest';

describe('risk policy',()=>{
  it('allows reads without approval',async()=>{vi.resetModules();const { requirePermission }=await import('../src/policy.js');expect(()=>requirePermission('READ')).not.toThrow();});
  it('blocks high-risk operations unless explicitly enabled and approved',async()=>{vi.resetModules();delete process.env.HETZNER_CLOUD_ALLOW_HIGH_RISK;const { requirePermission }=await import('../src/policy.js');expect(()=>requirePermission('HIGH_RISK',true)).toThrow();});
  it('blocks destructive operations by default',async()=>{vi.resetModules();delete process.env.HETZNER_CLOUD_ALLOW_DESTRUCTIVE;const { requirePermission }=await import('../src/policy.js');expect(()=>requirePermission('DESTRUCTIVE',true)).toThrow();});
});
