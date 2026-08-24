import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { assertBucketAllowed, assertFunctionAllowed, assertRegionAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, TOOL_RISK } from '../src/policy.js';
import { AwsManagedMcpTransport, preferMcp } from '../src/mcp.js';

describe('AWS connector configuration', () => {
  it('loads safe defaults without static credentials', () => {
    const c = loadConfig({ AWS_REGION: 'us-east-1' });
    expect(c.region).toBe('us-east-1');
    expect(c.mcpEndpoint).toBe('https://aws-mcp.us-east-1.api.aws/mcp');
    expect(c.preferMcp).toBe(true);
  });

  it('enforces region, bucket and function allowlists', () => {
    const c = loadConfig({ AWS_REGION: 'us-east-1', AWS_CONNECTOR_ALLOWED_REGIONS: 'us-east-1', AWS_CONNECTOR_ALLOWED_BUCKETS: 'safe-bucket', AWS_CONNECTOR_ALLOWED_FUNCTION_PREFIXES: 'agent-' });
    expect(() => assertRegionAllowed(c, 'eu-west-1')).toThrow(/not allowed/);
    expect(() => assertBucketAllowed(c, 'other')).toThrow(/not allowed/);
    expect(() => assertFunctionAllowed(c, 'prod-root')).toThrow(/not allowed/);
    expect(() => assertFunctionAllowed(c, 'agent-worker')).not.toThrow();
  });
});

describe('approval policy', () => {
  it('requires approval for high-risk actions', () => {
    const secret = 'unit-test-secret';
    const tool = 'aws.ec2.instance.stop';
    expect(TOOL_RISK[tool]).toBe('HIGH_RISK');
    expect(() => assertApproval(tool, undefined, secret)).toThrow(/approval/i);
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
  });
});

describe('managed MCP transport and fallback', () => {
  it('uses discovered run_script with a strict fixed tool name', async () => {
    let calls = 0;
    const fakeFetch: typeof fetch = async (_input, init) => {
      calls++;
      const request = JSON.parse(String(init?.body));
      const result = request.method === 'tools/list'
        ? { tools: [{ name: 'aws___run_script', inputSchema: { properties: { script: {} } } }] }
        : { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      return new Response(JSON.stringify({ jsonrpc: '2.0', id: request.id, result }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const c = loadConfig({ AWS_REGION: 'us-east-1', AWS_MCP_ACCESS_TOKEN: 'test-token' });
    const mcp = new AwsManagedMcpTransport(c, fakeFetch);
    await expect(mcp.runScript('print(1)')).resolves.toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('falls back to scoped SDK behavior when MCP fails', async () => {
    const fakeFetch: typeof fetch = async () => new Response('unavailable', { status: 503 });
    const c = loadConfig({ AWS_REGION: 'us-east-1', AWS_MCP_ACCESS_TOKEN: 'test-token' });
    const mcp = new AwsManagedMcpTransport(c, fakeFetch);
    await expect(preferMcp(mcp, 'print(1)', async () => ({ via: 'sdk' }))).resolves.toEqual({ via: 'sdk' });
  });
});

describe('tool registration source', () => {
  it('registers exactly the documented 12 provider-scoped tools', async () => {
    const source = await readFile(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(m => m[1]);
    expect(names).toEqual([
      'aws.identity.get', 'aws.s3.bucket.list', 'aws.s3.object.list', 'aws.s3.object.metadata', 'aws.s3.object.presign_get',
      'aws.ec2.instance.list', 'aws.ec2.instance.start', 'aws.ec2.instance.stop', 'aws.lambda.function.list', 'aws.lambda.function.get',
      'aws.cloudwatch.metric.get', 'aws.logs.filter'
    ]);
  });
});
