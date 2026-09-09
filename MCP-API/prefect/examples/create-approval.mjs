import { createHmac } from 'node:crypto';

const [tool, json] = process.argv.slice(2);
const secret = process.env.PREFECT_APPROVAL_SECRET;
if (!tool || !json || !secret) {
  console.error('Usage: PREFECT_APPROVAL_SECRET=... node examples/create-approval.mjs <tool> <json-payload-without-approval_token>');
  process.exit(2);
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
const payload = JSON.parse(json);
const digest = createHmac('sha256', secret).update(`${tool}\n${canonical(payload)}`).digest('hex');
console.log(digest);
