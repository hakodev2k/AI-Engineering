import crypto from 'node:crypto';

export function loadConfig(env = process.env) {
  const clientId = env.INFISICAL_CLIENT_ID;
  const clientSecret = env.INFISICAL_CLIENT_SECRET;
  if (!clientId) throw new Error('INFISICAL_CLIENT_ID is required');
  if (!clientSecret) throw new Error('INFISICAL_CLIENT_SECRET is required');
  const site = new URL(env.INFISICAL_SITE_URL || 'https://app.infisical.com');
  if (site.protocol !== 'https:') throw new Error('INFISICAL_SITE_URL must use HTTPS');
  if (site.username || site.password || (site.pathname && site.pathname !== '/') || site.search || site.hash) throw new Error('INFISICAL_SITE_URL must be an HTTPS origin only');
  const timeoutMs = Number(env.INFISICAL_TIMEOUT_MS || 10000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('INFISICAL_TIMEOUT_MS must be 1000..120000');
  if (env.INFISICAL_ENABLE_DESTRUCTIVE && !['true','false'].includes(env.INFISICAL_ENABLE_DESTRUCTIVE)) throw new Error('INFISICAL_ENABLE_DESTRUCTIVE must be true or false');
  return Object.freeze({siteUrl:site.origin,clientId,clientSecret,timeoutMs,approvalSecret:env.INFISICAL_APPROVAL_SECRET||'',destructiveEnabled:env.INFISICAL_ENABLE_DESTRUCTIVE==='true'});
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}
function stable(v){if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(stable).join(',')}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;}
