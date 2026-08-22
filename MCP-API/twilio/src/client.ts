import twilio from 'twilio';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { TwilioConfig } from './config.js';

const DOCS_MCP_URL = 'https://mcp.twilio.com/docs';
const DOC_TOOLS = new Set(['twilio__search', 'twilio__retrieve']);

export class TwilioConnectorClient {
  private readonly readClient: any;
  private readonly writeClient: any;
  private docsClient?: Client;

  constructor(private readonly config: TwilioConfig, injected?: { readClient?: any; writeClient?: any; docsClient?: Client }) {
    this.readClient = injected?.readClient ?? twilio(config.apiKey, config.apiSecret, {
      accountSid: config.accountSid,
      autoRetry: true,
      maxRetries: config.maxReadRetries,
      timeout: config.timeoutMs,
      keepAlive: true
    });
    this.writeClient = injected?.writeClient ?? twilio(config.apiKey, config.apiSecret, {
      accountSid: config.accountSid,
      autoRetry: false,
      timeout: config.timeoutMs,
      keepAlive: true
    });
    this.docsClient = injected?.docsClient;
  }

  private async docs(): Promise<Client> {
    if (this.docsClient) return this.docsClient;
    const client = new Client({ name: 'twilio-mcp-api-docs-client', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(DOCS_MCP_URL)));
    const tools = await client.listTools();
    const names = new Set(tools.tools.map(t => t.name));
    for (const expected of DOC_TOOLS) if (!names.has(expected)) throw new Error(`Official Twilio MCP tool missing: ${expected}`);
    this.docsClient = client;
    return client;
  }

  async apiSearch(query: string, version?: string): Promise<unknown> {
    const client = await this.docs();
    return client.callTool({ name: 'twilio__search', arguments: version ? { query, filter: { version } } : { query } });
  }

  async apiRetrieve(ids: string[]): Promise<unknown> {
    const client = await this.docs();
    return client.callTool({ name: 'twilio__retrieve', arguments: { ids } });
  }

  accountGet() { return this.readClient.api.v2010.accounts(this.config.accountSid).fetch(); }
  messageList(limit: number, to?: string, from?: string) { return this.readClient.messages.list({ limit, to, from }); }
  messageGet(sid: string) { return this.readClient.messages(sid).fetch(); }
  messageSend(input: { to: string; from: string; body: string }) { return this.writeClient.messages.create(input); }
  callList(limit: number, to?: string, from?: string) { return this.readClient.calls.list({ limit, to, from }); }
  callGet(sid: string) { return this.readClient.calls(sid).fetch(); }
  callCreate(input: { to: string; from: string; twiml: string }) { return this.writeClient.calls.create(input); }
  phoneNumberList(limit: number) { return this.readClient.incomingPhoneNumbers.list({ limit }); }
  phoneNumberGet(sid: string) { return this.readClient.incomingPhoneNumbers(sid).fetch(); }
}
