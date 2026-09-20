export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export type ToolPolicy = { risk: Risk; approval: boolean };

export const POLICY: Record<string, ToolPolicy> = {
  'browserless.page.content': { risk: 'READ', approval: false },
  'browserless.page.screenshot': { risk: 'READ', approval: false },
  'browserless.page.pdf': { risk: 'READ', approval: false },
  'browserless.page.scrape': { risk: 'READ', approval: false },
  'browserless.web.search': { risk: 'READ', approval: false },
  'browserless.site.map': { risk: 'READ', approval: false },
  'browserless.site.crawl': { risk: 'READ', approval: false },
  'browserless.page.export': { risk: 'WRITE', approval: true }
};

export function requireApproval(tool: string, approved?: boolean) {
  const p = POLICY[tool];
  if (!p) throw new Error(`Unknown tool policy: ${tool}`);
  if (p.approval && !approved) throw new Error(`Human approval required for ${tool}`);
}

export function assertPublicHttpUrl(raw: string): string {
  const u = new URL(raw);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only HTTP(S) URLs are allowed');
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) throw new Error('Local/private targets are blocked');
  if (/^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) throw new Error('Private network targets are blocked');
  return u.toString();
}
