import { describe, expect, it } from 'vitest';
import { approvalFor, config, enforce, execute, policy, type Upstream } from '../src/core.js';

class Fake implements Upstream {
  calls: Array<[string,Record<string,unknown>]> = [];
  async call(name: string, args: Record<string,unknown>) { this.calls.push([name,args]); return { ok:true }; }
  async close() {}
}
const env = { DESCOPE_MCP_ACCESS_TOKEN:'test-token', DESCOPE_REGION:'us', DESCOPE_ALLOW_WRITE:'true', DESCOPE_APPROVAL_SECRET:'0123456789abcdef', DESCOPE_TIMEOUT_MS:'5000' };

describe('Descope connector', () => {
  it('registers exactly eight curated capabilities', () => expect(Object.keys(policy)).toHaveLength(8));
  it('requires credentials', () => expect(() => config({} as NodeJS.ProcessEnv)).toThrow(/ACCESS_TOKEN/));
  it('pins regional official MCP hosts', () => {
    expect(config(env).url).toBe('https://mcp.descope.com');
    expect(config({...env,DESCOPE_REGION:'eu'}).url).toBe('https://mcp.euc1.descope.com');
  });
  it('allows reads without approval', () => expect(() => enforce('descope.project.read',{},config(env))).not.toThrow());
  it('denies writes when operator flag is off', () => expect(() => enforce('descope.project.write',{},config({...env,DESCOPE_ALLOW_WRITE:'false'}))).toThrow(/disabled/));
  it('binds approval to exact payload', () => {
    const cfg=config(env); const args:Record<string,unknown>={operation:'x',input:{a:1}}; args.approvalId=approvalFor(cfg.approvalSecret,'descope.project.write',args);
    expect(() => enforce('descope.project.write',args,cfg)).not.toThrow();
    expect(() => enforce('descope.project.write',{...args,input:{a:2}},cfg)).toThrow(/approval/);
  });
  it('strips approval before forwarding', async () => {
    const cfg=config(env); const fake=new Fake(); const args:Record<string,unknown>={operation:'x'}; args.approvalId=approvalFor(cfg.approvalSecret,'descope.project.write',args);
    await execute('descope.project.write',args,fake,cfg);
    expect(fake.calls[0][0]).toBe('project_write'); expect(fake.calls[0][1]).toEqual({operation:'x'});
  });
  it('maps docs search to official tool', async () => { const fake=new Fake(); await execute('descope.docs.search',{query:'MCP OAuth'},fake,config(env)); expect(fake.calls[0][0]).toBe('docs_search'); });
});
