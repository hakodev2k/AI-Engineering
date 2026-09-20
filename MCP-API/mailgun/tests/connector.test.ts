import { describe, expect, it, vi } from 'vitest';

process.env.MAILGUN_API_KEY = 'test-key';
process.env.MAILGUN_ALLOW_WRITE = 'false';
process.env.MAILGUN_ALLOW_HIGH_RISK = 'true';
process.env.MAILGUN_ALLOW_DESTRUCTIVE = 'false';

const { MailgunClient } = await import('../src/client.js');
const { tools, invoke } = await import('../src/tools.js');

describe('Mailgun connector', () => {
  it('registers unique provider-scoped tools', () => {
    expect(tools.length).toBeGreaterThanOrEqual(8);
    expect(new Set(tools.map(t => t.name)).size).toBe(tools.length);
    expect(tools.every(t => t.name.startsWith('mailgun.'))).toBe(true);
  });

  it('executes a read operation without approval', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ total_count: 1, items: [{ name:'example.com' }] }), { status:200, headers:{'content-type':'application/json'} }));
    const client = new MailgunClient(fetchMock as any);
    const spec = tools.find(t => t.name === 'mailgun.domain.list')!;
    const result = await invoke(spec, { limit:10, skip:0 }, client);
    expect(result.total_count).toBe(1);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('requires explicit approval for sending email', async () => {
    const client = new MailgunClient(vi.fn() as any);
    const spec = tools.find(t => t.name === 'mailgun.message.send')!;
    await expect(invoke(spec, { domain:'example.com', from:'a@example.com', to:['b@example.com'], subject:'Hi', text:'Hello', approved:false }, client)).rejects.toThrow(/approval/i);
  });

  it('blocks destructive operations by default', async () => {
    const client = new MailgunClient(vi.fn() as any);
    const spec = tools.find(t => t.name === 'mailgun.webhook.delete')!;
    await expect(invoke(spec, { domain:'example.com', type:'delivered', approved:true }, client)).rejects.toThrow(/disabled/i);
  });

  it('rejects non-HTTPS webhook URLs', () => {
    const spec = tools.find(t => t.name === 'mailgun.webhook.set')!;
    expect(() => spec.schema.parse({ domain:'example.com', type:'delivered', urls:['http://example.com/hook'], approved:true })).toThrow();
  });
});
