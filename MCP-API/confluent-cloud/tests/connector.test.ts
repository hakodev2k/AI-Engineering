import { describe, expect, it } from 'vitest';
import { loadConfig, basicAuth, type Config } from '../src/config.js';
import { BINDINGS, approvalFor, enforce, augmentSchema } from '../src/policy.js';
import { createServer } from '../src/server.js';
import type { Scope } from '../src/policy.js';
import type { Upstream, UpstreamTool } from '../src/upstream.js';

const baseConfig: Config = {
  apiKey: 'key', apiSecret: 'secret', globalUrl: 'https://api.confluent.cloud/mcp/v1',
  enableWrites: false, timeoutMs: 20000, maxReadRetries: 2
};

class FakeUpstream implements Upstream {
  calls: Array<{scope:Scope;name:string;retrySafe:boolean}> = [];
  async list(scope: Scope): Promise<UpstreamTool[]> {
    return BINDINGS.filter(b=>b.scope===scope).map(b=>({name:b.upstream,inputSchema:{type:'object',properties:{id:{type:'string'}}}}));
  }
  async call(scope: Scope, name: string, _args: Record<string,unknown>, retrySafe: boolean) {
    this.calls.push({scope,name,retrySafe}); return {ok:true};
  }
  async close() {}
}

describe('configuration', () => {
  it('requires credentials', () => expect(()=>loadConfig({})).toThrow(/required/));
  it('requires complete regional coordinates', () => expect(()=>loadConfig({CONFLUENT_API_KEY:'a',CONFLUENT_API_SECRET:'b',CONFLUENT_CLOUD_PROVIDER:'aws'})).toThrow(/Regional MCP/));
  it('derives only official regional hosts', () => {
    const c=loadConfig({CONFLUENT_API_KEY:'a',CONFLUENT_API_SECRET:'b',CONFLUENT_CLOUD_PROVIDER:'aws',CONFLUENT_CLOUD_REGION:'us-east-1',CONFLUENT_ORGANIZATION_ID:'org-123'});
    expect(c.regionalUrl).toBe('https://mcp.us-east-1.aws.confluent.cloud/mcp/v1/organizations/org-123');
  });
  it('keeps credentials in Basic auth layer', () => expect(basicAuth(baseConfig)).toBe('Basic a2V5OnNlY3JldA=='));
});

describe('policy', () => {
  it('defines exactly 20 provider-scoped capabilities', () => {
    expect(BINDINGS).toHaveLength(20);
    expect(new Set(BINDINGS.map(b=>b.external)).size).toBe(20);
    expect(BINDINGS.every(b=>b.external.startsWith('confluent.'))).toBe(true);
  });
  it('allows reads without approval', () => expect(enforce(BINDINGS[0],{id:'x'},baseConfig)).toEqual({id:'x'}));
  it('denies high-risk operations while writes are disabled', () => {
    const b=BINDINGS.find(x=>x.external==='confluent.connector.restart')!;
    expect(()=>enforce(b,{},baseConfig)).toThrow(/disabled/);
  });
  it('binds approval to exact payload and strips token upstream', () => {
    const b=BINDINGS.find(x=>x.external==='confluent.connector.config.update')!;
    const config={...baseConfig,enableWrites:true,approvalSecret:'0123456789abcdef0123456789abcdef'};
    const args={connector_name:'sink-a',config:{tasks_max:'2'}};
    const token=approvalFor(config.approvalSecret,b.external,args);
    expect(enforce(b,{...args,approval_token:token},config)).toEqual(args);
    expect(()=>enforce(b,{...args,config:{tasks_max:'3'},approval_token:token},config)).toThrow(/approval/);
  });
  it('makes discovered schemas strict and requires approvals only for risky tools', () => {
    const risky=BINDINGS.find(x=>x.risk==='HIGH_RISK')!;
    const schema=augmentSchema({type:'object',properties:{id:{type:'string'}},required:['id']},risky);
    expect(schema.additionalProperties).toBe(false);
    expect(schema.required).toContain('approval_token');
  });
});

describe('server construction', () => {
  it('accepts the reviewed global tool inventory without live credentials', async () => {
    const fake=new FakeUpstream();
    const server=await createServer(baseConfig,fake);
    expect(server).toBeTruthy();
    await server.close();
  });
});
