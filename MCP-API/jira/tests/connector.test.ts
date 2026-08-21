import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig, assertCloudAllowed, assertProjectAllowed } from '../src/config.js';
import { approvalFor, assertApproval, TOOL_RISK } from '../src/policy.js';
import { JiraUpstream } from '../src/upstream.js';

const baseConfig = {
  accessToken: 'test-token',
  mcpUrl: 'https://mcp.atlassian.com/v1/mcp/authv2',
  allowedCloudIds: new Set<string>(),
  allowedProjectKeys: new Set<string>(),
  approvalSecret: 'approval-secret'
};

afterEach(() => vi.unstubAllGlobals());

describe('configuration and policy', () => {
  it('requires credentials and rejects non-official MCP hosts', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/ATLASSIAN_ACCESS_TOKEN/);
    expect(() => loadConfig({ ATLASSIAN_ACCESS_TOKEN: 'x', ATLASSIAN_MCP_URL: 'https://evil.example/mcp' } as NodeJS.ProcessEnv)).toThrow(/official/);
  });

  it('enforces cloud and project allowlists', () => {
    const cfg = { ...baseConfig, allowedCloudIds: new Set(['cloud-1']), allowedProjectKeys: new Set(['ENG']) };
    expect(() => assertCloudAllowed(cfg, 'cloud-2')).toThrow(/not allowed/);
    expect(() => assertProjectAllowed(cfg, 'OPS')).toThrow(/not allowed/);
    expect(() => assertProjectAllowed(cfg, 'ENG')).not.toThrow();
  });

  it('requires a valid out-of-band approval for writes and high-risk tools', () => {
    expect(TOOL_RISK['jira.issue.transition']).toBe('HIGH_RISK');
    const token = approvalFor('jira.issue.create', 'secret');
    expect(() => assertApproval('jira.issue.create', token, 'secret')).not.toThrow();
    expect(() => assertApproval('jira.issue.create', 'bad', 'secret')).toThrow(/Invalid approval/);
  });
});

describe('REST fallback', () => {
  it('creates an issue without retrying or exposing the token in the body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: '10001', key: 'ENG-1' }), { status: 201, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new JiraUpstream(baseConfig);
    const result = await client.createIssueRest({ cloudId: 'cloud-1', projectKey: 'ENG', issueTypeId: '10001', summary: 'Test issue' });
    expect(result).toEqual({ id: '10001', key: 'ENG-1' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toContain('test-token');
    expect(String(init.body)).not.toContain('test-token');
  });

  it('preserves provider throttling information and does not retry POST', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ errorMessages: ['rate limited'] }), { status: 429, headers: { 'retry-after': '2' } }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new JiraUpstream(baseConfig);
    await expect(client.createIssueRest({ cloudId: 'cloud-1', projectKey: 'ENG', issueTypeId: '10001', summary: 'Test issue' })).rejects.toThrow(/retry-after=2/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
