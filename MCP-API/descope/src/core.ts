import crypto from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export interface Upstream { call(name: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<unknown>; close(): Promise<void>; }

export const policy = {
  'descope.operation.discover': ['list_operations','READ'],
  'descope.session.inspect': ['session','READ'],
  'descope.project.read': ['project_read','READ'],
  'descope.project.write': ['project_write','WRITE'],
  'descope.access_control.read': ['access_control_read','READ'],
  'descope.access_control.write': ['access_control_write','HIGH_RISK'],
  'descope.docs.search': ['docs_search','READ'],
  'descope.docs.ask': ['docs_ask_question','READ']
} as const;

export function config(env = process.env) {
  const region = env.DESCOPE_REGION ?? 'us';
  if (!['us','eu'].includes(region)) throw new Error('DESCOPE_REGION must be us or eu');
  const token = env.DESCOPE_MCP_ACCESS_TOKEN;
  if (!token) throw new Error('DESCOPE_MCP_ACCESS_TOKEN is required; obtain it through a trusted Descope OAuth 2.1 flow');
  const timeoutMs = Number(env.DESCOPE_TIMEOUT_MS ?? 20000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('DESCOPE_TIMEOUT_MS must be 1000..120000');
  return { region, token, timeoutMs, allowWrite: env.DESCOPE_ALLOW_WRITE === 'true', approvalSecret: env.DESCOPE_APPROVAL_SECRET ?? '', url: region === 'eu' ? 'https://mcp.euc1.descope.com' : 'https://mcp.descope.com' };
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',') + '}';
  return JSON.stringify(value);
}

export function approvalFor(secret: string, tool: string, args: Record<string, unknown>) {
  const clean = { ...args }; delete clean.approvalId;
  return crypto.createHmac('sha256', secret).update(tool + '\n' + canonical(clean)).digest('hex');
}

export function enforce(tool: keyof typeof policy, args: Record<string, unknown>, cfg: ReturnType<typeof config>) {
  const risk = policy[tool][1] as Risk;
  if (risk === 'READ') return;
  if (!cfg.allowWrite) throw new Error('Write operations are disabled by DESCOPE_ALLOW_WRITE');
  if (!cfg.approvalSecret) throw new Error('DESCOPE_APPROVAL_SECRET is required for mutations');
  const got = String(args.approvalId ?? '');
  const expected = approvalFor(cfg.approvalSecret, tool, args);
  if (!got || got.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected))) throw new Error('Explicit payload-bound human approval is required');
}

export class DescopeUpstream implements Upstream {
  private client = new Client({ name: 'descope-safe-connector', version: '1.0.0' });
  private connected = false;
  constructor(private cfg: ReturnType<typeof config>) {}
  async connect() {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.cfg.url), { requestInit: { headers: { Authorization: `Bearer ${this.cfg.token}` } } });
    await this.client.connect(transport);
    this.connected = true;
  }
  async call(name: string, args: Record<string, unknown>, signal?: AbortSignal) {
    await this.connect();
    const timeout = AbortSignal.timeout(this.cfg.timeoutMs);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const result = await this.client.callTool({ name, arguments: args }, undefined, { signal: combined });
    return { untrustedProviderData: true, result };
  }
  async close() { if (this.connected) await this.client.close(); }
}

export async function execute(tool: keyof typeof policy, args: Record<string, unknown>, upstream: Upstream, cfg: ReturnType<typeof config>) {
  enforce(tool, args, cfg);
  const forwarded = { ...args }; delete forwarded.approvalId;
  return upstream.call(policy[tool][0], forwarded);
}
