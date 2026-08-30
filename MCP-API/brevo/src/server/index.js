import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from '../auth/config.js';
import { BrevoClient, BrevoError } from '../client/brevo-client.js';
import { TOOL_DEFINITIONS, payloadWithoutApproval } from '../tools/definitions.js';
import { authorize } from '../tools/policy.js';
import { sanitize } from '../models/sanitize.js';

function validateSemantic(name, payload) {
  if (name === 'brevo.contact.list' && payload.segmentId && payload.listIds?.length) throw new Error('segmentId and listIds are mutually exclusive');
  if (name === 'brevo.contact.create') {
    const hasSms = typeof payload.attributes?.SMS === 'string' && payload.attributes.SMS.length > 0;
    if (!payload.email && !payload.ext_id && !hasSms) throw new Error('contact.create requires email, ext_id, or attributes.SMS');
  }
  if (name === 'brevo.contact.update' && payload.attributes && Object.prototype.hasOwnProperty.call(payload.attributes, 'EMAIL')) throw new Error('Changing EMAIL is not exposed because Brevo may alter blocklist subscription state');
  if (name === 'brevo.campaign.create') {
    const contents = [payload.htmlContent != null, payload.templateId != null].filter(Boolean).length;
    if (contents !== 1) throw new Error('campaign.create requires exactly one of htmlContent or templateId');
  }
  if (name === 'brevo.transactional_email.send') {
    const usingTemplate = payload.templateId != null;
    if (!usingTemplate && (!payload.sender || !payload.subject || (!payload.htmlContent && !payload.textContent))) throw new Error('Without templateId, sender, subject, and htmlContent or textContent are required');
  }
  if (name === 'brevo.webhook.create') {
    const url = new URL(payload.url);
    if (url.username || url.password) throw new Error('Webhook URL must not embed credentials');
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local')) throw new Error('Webhook URL must not target local hosts');
  }
}

export function createServer({ config = loadConfig(), client = null } = {}) {
  const api = client || new BrevoClient(config);
  const server = new Server({ name: 'brevo-safe-connector', version: '1.0.0' }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFINITIONS }));
  server.setRequestHandler(CallToolRequestSchema, async (req, extra) => {
    const name = req.params.name, args = req.params.arguments || {}, payload = payloadWithoutApproval(args);
    try {
      validateSemantic(name, payload); authorize(config, name, payload, args.approval_token);
      const signal = extra?.signal; let result;
      switch (name) {
        case 'brevo.account.get': result = await api.getAccount(signal); break;
        case 'brevo.contact.list': result = await api.listContacts({ limit: payload.limit ?? 50, offset: payload.offset ?? 0, ...payload }, signal); break;
        case 'brevo.contact.get': result = await api.getContact(payload, signal); break;
        case 'brevo.contact.create': result = await api.createContact({ ...payload, forceMerge: false, getId: payload.getId ?? true }, signal); break;
        case 'brevo.contact.update': result = await api.updateContact({ ...payload, forceMerge: false }, signal); break;
        case 'brevo.contact_list.list': result = await api.listContactLists({ limit: payload.limit ?? 10, offset: payload.offset ?? 0, ...payload }, signal); break;
        case 'brevo.campaign.list': result = await api.listCampaigns({ limit: payload.limit ?? 50, offset: payload.offset ?? 0, excludeHtmlContent: payload.excludeHtmlContent ?? true, ...payload }, signal); break;
        case 'brevo.campaign.get': result = await api.getCampaign({ excludeHtmlContent: payload.excludeHtmlContent ?? true, ...payload }, signal); break;
        case 'brevo.campaign.create': result = await api.createCampaign(payload, signal); break;
        case 'brevo.campaign.send': result = await api.sendCampaign(payload, signal); break;
        case 'brevo.transactional_email.send': result = await api.sendTransactionalEmail(payload, signal); break;
        case 'brevo.webhook.list': result = await api.listWebhooks(payload, signal); break;
        case 'brevo.webhook.create': result = await api.createWebhook(payload, signal); break;
        case 'brevo.webhook.delete': result = await api.deleteWebhook(payload, signal); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }
      const clean = sanitize(result);
      return { content:[{type:'text',text:JSON.stringify({untrusted_provider_data:true,data:clean},null,2)}], structuredContent:{untrusted_provider_data:true,data:clean} };
    } catch (error) {
      return { isError:true, content:[{type:'text',text:JSON.stringify(normalize(error))}] };
    }
  });
  return server;
}
function normalize(error) {
  if (error instanceof BrevoError) return { error:error.message, status:error.status, code:error.code, retryAfter:error.retryAfter, rateLimit:error.rateLimit, retryable:error.status===429 || error.status>=500 };
  return { error:error?.message || String(error), retryable:false };
}
if (import.meta.url === `file://${process.argv[1]}`) { const server = createServer(); await server.connect(new StdioServerTransport()); }
