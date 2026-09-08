import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { Policy } from '../src/policy.js';
import { getTool, tools } from '../src/tools.js';

describe('tool catalog',()=>{
  it('registers unique provider-scoped tools',()=>{ const names=tools.map(t=>t.name); expect(new Set(names).size).toBe(names.length); expect(names.every(n=>n.startsWith('kubernetes.'))).toBe(true); });
  it('validates resource names',()=>{ const t=getTool('kubernetes.pod.get')!; expect(()=>t.schema.parse({namespace:'default',name:''})).toThrow(z.ZodError); expect(t.schema.parse({namespace:'default',name:'api-7d9'})).toBeTruthy(); });
  it('bounds log volume',()=>{ const t=getTool('kubernetes.pod.logs')!; expect(()=>t.schema.parse({namespace:'default',name:'api',tailLines:10001})).toThrow(); });
});

describe('approval policy',()=>{
  it('allows reads',()=>expect(()=>new Policy({allowWrite:false,allowHighRisk:false,allowDestructive:false}).assert('READ')).not.toThrow());
  it('requires high-risk enablement and approval',()=>{ const p=new Policy({allowWrite:true,allowHighRisk:true,allowDestructive:false}); expect(()=>p.assert('HIGH_RISK')).toThrow(/approval/i); expect(()=>p.assert('HIGH_RISK',{approved:true})).not.toThrow(); });
  it('keeps destructive actions disabled by default',()=>expect(()=>new Policy({allowWrite:true,allowHighRisk:true,allowDestructive:false}).assert('DESTRUCTIVE',{approved:true})).toThrow(/disabled/i));
});
