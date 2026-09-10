import crypto from 'node:crypto';

const [toolName, payloadJson] = process.argv.slice(2);
const secret = process.env.TIGER_CONNECTOR_APPROVAL_SECRET;
if (!secret || secret.length < 16) throw new Error('TIGER_CONNECTOR_APPROVAL_SECRET must be set and at least 16 characters');
if (!toolName || !payloadJson) throw new Error('Usage: node examples/create-approval.mjs <tool-name> <json-payload>');

const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const payload = JSON.parse(payloadJson);
delete payload.approvalToken;
const digest = crypto.createHmac('sha256', secret).update(`${toolName}\n${canonical(payload)}`).digest('hex');
process.stdout.write(`${digest}\n`);
