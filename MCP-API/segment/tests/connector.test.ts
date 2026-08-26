import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { approvalDigest, loadConfig } from '../src/config.js';
import { SegmentApiError, SegmentClient } from '../src/client.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';

describe('Segment connector configuration', () => {
  it('requires a token and selects the EU endpoint', () => {
    expect(() => loadConfig({})).toThrow(/SEGMENT_PUBLIC_API_TOKEN/);
    const config = loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'secret', SEGMENT_REGION: 'eu' });
    expect(config.baseUrl).toBe('https://eu1.api.segmentapis.com');
  });

  it('rejects invalid retry and timeout settings', () => {
    expect(() => loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'x', SEGMENT_MAX_RETRIES: '9' })).toThrow();
    expect(() => loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'x', SEGMENT_REQUEST_TIMEOUT_MS: '5' })).toThrow();
  });
});

describe('tool registration and permission policy', () => {
  it('registers every declared policy tool in the MCP server source', () => {
    const serverSource = readFileSync(fileURLToPath(new URL('../src/server.ts', import.meta.url)), 'utf8');
    for (const tool of Object.keys(TOOL_POLICY)) expect(serverSource).toContain(`server.tool('${tool}'`);
  });

  it('classifies destructive and read operations', () => {
    expect(TOOL_POLICY['segment.workspace.get']).toEqual({ risk: 'READ', approval: false });
    expect(TOOL_POLICY['segment.tracking_plan.delete']).toEqual({ risk: 'DESTRUCTIVE', approval: true });
  });

  it('requires payload-bound approval for writes', () => {
    const config = loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'token', SEGMENT_APPROVAL_SECRET: 'approval-secret' });
    const payload = { name: 'Plan', type: 'LIVE' };
    expect(() => assertApproval(config, 'segment.tracking_plan.create', payload)).toThrow(/explicit approval/);
    const approvalId = approvalDigest('approval-secret', 'segment.tracking_plan.create', payload);
    expect(() => assertApproval(config, 'segment.tracking_plan.create', payload, approvalId)).not.toThrow();
    expect(() => assertApproval(config, 'segment.tracking_plan.create', { ...payload, name: 'Other' }, approvalId)).toThrow(/Invalid approval/);
  });
});

describe('Segment REST client', () => {
  it('sends Bearer auth without exposing it in the response', async () => {
    const fetchMock = vi.fn(async (_url: URL, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).authorization).toBe('Bearer token');
      return new Response(JSON.stringify({ data: { workspace: { id: 'w1' } } }), { status: 200 });
    });
    const client = new SegmentClient(loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'token' }), fetchMock as typeof fetch);
    await expect(client.get('/')).resolves.toEqual({ data: { workspace: { id: 'w1' } } });
  });

  it('retries idempotent 429 responses with bounded attempts', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [] }), { status: 429, headers: { 'retry-after': '0' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { sources: [] } }), { status: 200 }));
    const client = new SegmentClient(loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'token', SEGMENT_MAX_RETRIES: '1' }), fetchMock as typeof fetch);
    await expect(client.get('/sources')).resolves.toEqual({ data: { sources: [] } });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not blindly retry a failed write', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ errors: [{ message: 'busy' }] }), { status: 503 }));
    const client = new SegmentClient(loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'token', SEGMENT_MAX_RETRIES: '3' }), fetchMock as typeof fetch);
    await expect(client.post('/tracking-plans', { name: 'Plan', type: 'LIVE' })).rejects.toBeInstanceOf(SegmentApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('maps provider validation failures without retrying', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ errors: [{ type: 'input-validation' }] }), { status: 422 }));
    const client = new SegmentClient(loadConfig({ SEGMENT_PUBLIC_API_TOKEN: 'token' }), fetchMock as typeof fetch);
    await expect(client.get('/sources/bad')).rejects.toMatchObject({ status: 422 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
