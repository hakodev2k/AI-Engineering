import { describe, expect, it, vi } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertApproval, TOOL_POLICY } from '../src/policy.js';
import { ZoomRestClient, ZoomError } from '../src/rest.js';

const base = { accessToken: 'token', apiBaseUrl: 'https://api.zoom.us/v2', approvalSecret: 'secret', timeoutMs: 1000, maxRetries: 1 };

describe('config', () => {
  it('requires credentials', () => expect(() => loadConfig({})).toThrow(/ZOOM_ACCESS_TOKEN/));
  it('rejects non-Zoom base URL to prevent SSRF', () => expect(() => loadConfig({ZOOM_ACCESS_TOKEN:'x',ZOOM_API_BASE_URL:'https://evil.example'})).toThrow(/ZOOM_API_BASE_URL/));
});

describe('approval policy', () => {
  it('marks deletion destructive', () => expect(TOOL_POLICY['zoom.meeting.delete']).toEqual({risk:'DESTRUCTIVE',approval:true}));
  it('accepts payload-bound approval', () => {
    const payload = {meetingId:'123'};
    const id = approvalDigest('secret','zoom.meeting.delete',payload);
    expect(() => assertApproval(base,'zoom.meeting.delete',payload,id)).not.toThrow();
  });
  it('denies missing approval', () => expect(() => assertApproval(base,'zoom.meeting.create',{topic:'x'})).toThrow(/explicit approval/));
  it('denies approval replay against another payload', () => {
    const id = approvalDigest('secret','zoom.meeting.create',{topic:'a'});
    expect(() => assertApproval(base,'zoom.meeting.create',{topic:'b'},id)).toThrow(/Invalid approval/);
  });
});

describe('REST client', () => {
  it('adds bearer auth and maps JSON', async () => {
    const f = vi.fn(async (_url: any, init: any) => {
      expect(init.headers.Authorization).toBe('Bearer token');
      return new Response(JSON.stringify({id:1}), {status:200,headers:{'content-type':'application/json'}});
    });
    const c = new ZoomRestClient(base, f as any);
    await expect(c.get('/meetings/1')).resolves.toEqual({id:1});
  });
  it('preserves retry-after on throttling after bounded retry', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({code:429,message:'Too Many Requests'}), {status:429,headers:{'retry-after':'0'}}));
    const c = new ZoomRestClient(base, f as any);
    await expect(c.get('/meetings/1')).rejects.toBeInstanceOf(ZoomError);
    expect(f).toHaveBeenCalledTimes(2);
  });
  it('does not retry writes', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({code:500,message:'failed'}), {status:500}));
    const c = new ZoomRestClient(base, f as any);
    await expect(c.post('/users/me/meetings',{topic:'x'})).rejects.toBeInstanceOf(ZoomError);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('supports 204 responses', async () => {
    const f = vi.fn(async () => new Response(null,{status:204}));
    const c = new ZoomRestClient(base, f as any);
    await expect(c.del('/meetings/1')).resolves.toEqual({ok:true,status:204});
  });
});
