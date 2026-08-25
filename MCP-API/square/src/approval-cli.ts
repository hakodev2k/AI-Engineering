import { approvalToken } from './auth.js';

const [toolName, payloadJson] = process.argv.slice(2);
const secret = process.env.SQUARE_APPROVAL_SECRET;
if (!secret || !toolName || !payloadJson) {
  console.error('Usage: SQUARE_APPROVAL_SECRET=... node dist/approval-cli.js <tool-name> <payload-json>');
  process.exit(2);
}
let payload: unknown;
try {
  payload = JSON.parse(payloadJson);
} catch {
  console.error('payload-json must be valid JSON and must exactly match the tool payload excluding approvalId');
  process.exit(2);
}
process.stdout.write(approvalToken(secret, toolName, payload) + '\n');
