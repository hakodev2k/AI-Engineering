import { createHmac } from 'node:crypto';

const [tool, raw] = process.argv.slice(2);
const secret = process.env.WASABI_APPROVAL_SECRET;
if (!tool || !raw || !secret) {
  console.error('Usage: WASABI_APPROVAL_SECRET=... node examples/create-approval.mjs <tool> <json-payload>');
  process.exit(1);
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).filter(([k]) => k !== 'approvalToken').sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const payload = JSON.parse(raw);
const digest = createHmac('sha256', secret).update(`${tool}\n${canonical(payload)}`).digest('hex');
console.log(digest);
