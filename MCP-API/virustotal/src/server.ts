import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { assertSubmissionAllowed, requireSubmissionApproval } from './policy.js';
import { VirusTotalUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new VirusTotalUpstream(config);
const server = new McpServer({ name: 'virustotal-mcp-connector', version: '1.0.0' });
const hash = z.string().regex(/^(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})$/);
const sha256 = z.string().regex(/^[a-fA-F0-9]{64}$/);
const output = (v: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ untrusted_provider_data: true, result: v }) }] });

server.tool('virustotal.file.report.get', 'READ: retrieve an existing VirusTotal file report; a missing/clean result is not a safety verdict.', { hash }, async a => output(await upstream.call('get_file_report', { hash: a.hash })));
server.tool('virustotal.url.report.get', 'READ: retrieve an existing report for an authorized HTTP(S) URL; the full URL is disclosed upstream.', { url: z.string().url().refine(v => /^https?:\/\//i.test(v), 'Only HTTP(S) URLs are supported') }, async a => output(await upstream.call('get_url_report', { url: a.url })));
server.tool('virustotal.domain.report.get', 'READ: retrieve a domain report.', { domain: z.string().min(1).max(253).regex(/^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/) }, async a => output(await upstream.call('get_domain_report', { domain: a.domain })));
server.tool('virustotal.ip.report.get', 'READ: retrieve an IPv4/IPv6 report.', { ip: z.string().min(2).max(45).regex(/^[0-9a-fA-F:.]+$/) }, async a => output(await upstream.call('get_ip_report', { ip: a.ip })));
server.tool('virustotal.analysis.get', 'READ: retrieve one analysis registered to the current VTAI account.', { analysisId: z.string().min(1).max(300) }, async a => output(await upstream.call('get_analysis', { analysis_id: a.analysisId })));
server.tool('virustotal.submission.get', 'READ: recover the current account submission receipt without resubmitting.', { sha256 }, async a => output(await upstream.call('get_submission', { sha256: a.sha256.toLowerCase() })));
server.tool('virustotal.file.submit', 'HIGH_RISK: publicly share authorized file bytes with VirusTotal. Requires explicit HMAC approval and optional SHA-256 allowlist.', { sha256, contentBase64: z.string().min(1).max(32_000_000), approvalId: z.string().length(64) }, async a => {
  const digest = a.sha256.toLowerCase();
  assertSubmissionAllowed(digest, config.submitAllowlist);
  requireSubmissionApproval('virustotal.file.submit', digest, a.approvalId, config.approvalSecret);
  const bytes = Buffer.from(a.contentBase64, 'base64');
  if (bytes.length > 24_000_000) throw new Error('Decoded file exceeds upstream 24,000,000-byte limit');
  if (bytes.toString('base64').replace(/=+$/,'') !== a.contentBase64.replace(/=+$/,'')) throw new Error('contentBase64 must be canonical base64');
  if (await import('node:crypto').then(c => c.createHash('sha256').update(bytes).digest('hex')) !== digest) throw new Error('sha256 does not match contentBase64');
  return output(await upstream.call('submit_file', { sha256: digest, content_base64: a.contentBase64 }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
