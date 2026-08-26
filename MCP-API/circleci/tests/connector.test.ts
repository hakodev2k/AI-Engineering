import { describe, expect, it, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/app.js';
import { approvalDigest, loadConfig, type Config } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { CircleCiRestClient } from '../src/rest.js';

const config: Config = {
  apiToken: 'test-token',
  mcpBearerToken: 'test-token',
  apiBaseUrl: 'https://circleci.com/api/v2',
  mcpUrl: 'https://mcp.circleci.com/v1/mcp',
  requestTimeoutMs: 1000,
  maxRetries: 2,
  approvalSecret: 'human-secret'
};

describe('configuration and policy', () => {
  it('requires credentials and validates secure URLs', () => {
    expect(() => loadConfig({})).toThrow(/CIRCLECI_TOKEN/);
    expect(() => loadConfig({ CIRCLECI_TOKEN: 'x', CIRCLECI_API_BASE_URL: 'http://example.com' })).toThrow(/HTTPS/);
    expect(loadConfig({ CIRCLECI_TOKEN: 'x' }).apiToken).toBe('x');
  });

  it('binds approvals to both tool and exact arguments', () => {
    const args = { workflowId: '11111111-1111-4111-8111-111111111111', fromFailed: true };
    const token = approvalDigest('human-secret', 'circleci.workflow.rerun', args);
    expect(() => assertApproval('circleci.workflow.rerun', args, token, 'human-secret')).not.toThrow();
    expect(() => assertApproval('circleci.workflow.rerun', { ...args, fromFailed: false }, token, 'human-secret')).toThrow(/Invalid approval/);
  });

  it('classifies all external tools', () => {
    expect(Object.keys(TOOL_POLICY)).toHaveLength(14);
    expect(TOOL_POLICY['circleci.pipeline.trigger']).toEqual({ risk: 'WRITE', approvalRequired: true });
    expect(TOOL_POLICY['circleci.workflow.cancel']).toEqual({ risk: 'HIGH_RISK', approvalRequired: true });
  });
});

describe('REST reliability', () => {
  it('retries a throttled GET and preserves Retry-After behavior', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'throttled' }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'pipeline' }), { status: 200 }));
    const client = new CircleCiRestClient(config, fetchMock as typeof fetch);
    await expect(client.getPipeline('11111111-1111-4111-8111-111111111111')).resolves.toEqual({ id: 'pipeline' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('never retries non-idempotent pipeline triggers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'throttled' }), { status: 429, headers: { 'retry-after': '0' } }));
    const client = new CircleCiRestClient(config, fetchMock as typeof fetch);
    await expect(client.triggerPipeline(
      'gh/acme/service',
      '11111111-1111-4111-8111-111111111111',
      { branch: 'main' },
      { branch: 'main' }
    )).rejects.toMatchObject({ status: 429 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('MCP tool registration', () => {
  it('registers the documented 14-tool external contract and can execute a read tool with injected dependencies', async () => {
    const rest = {
      getPipeline: vi.fn().mockResolvedValue({ id: '11111111-1111-4111-8111-111111111111', state: 'created' }),
      triggerPipeline: vi.fn()
    };
    const upstream = { call: vi.fn().mockResolvedValue({ content: [{ type: 'text', text: 'ok' }] }) };
    const server = createServer(config, { rest, upstream });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual(Object.keys(TOOL_POLICY).sort());

    const result = await client.callTool({
      name: 'circleci.pipeline.get',
      arguments: { pipelineId: '11111111-1111-4111-8111-111111111111' }
    });
    expect(result.isError).not.toBe(true);
    expect(rest.getPipeline).toHaveBeenCalledTimes(1);

    await client.close();
    await server.close();
  });

  it('denies an approval-gated write before reaching CircleCI', async () => {
    const rest = { getPipeline: vi.fn(), triggerPipeline: vi.fn() };
    const upstream = { call: vi.fn() };
    const server = createServer(config, { rest, upstream });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const result = await client.callTool({
      name: 'circleci.pipeline.trigger',
      arguments: {
        projectSlug: 'gh/acme/service',
        definitionId: '11111111-1111-4111-8111-111111111111',
        configBranch: 'main',
        checkoutBranch: 'main'
      }
    });
    expect(result.isError).toBe(true);
    expect(rest.triggerPipeline).not.toHaveBeenCalled();

    await client.close();
    await server.close();
  });
});
