import crypto from 'node:crypto';

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const [tool, json] = process.argv.slice(2);
const secret = process.env.POSTMARK_APPROVAL_SECRET;
if (!tool || !json || !secret) {
  console.error('Usage: POSTMARK_APPROVAL_SECRET=... node examples/create-approval.mjs <tool> <json-args-without-approval>');
  process.exit(2);
}
const args = JSON.parse(json);
const digest = crypto.createHmac('sha256', secret).update(`${tool}\n${stable(args)}`).digest('hex');
console.log(digest);
