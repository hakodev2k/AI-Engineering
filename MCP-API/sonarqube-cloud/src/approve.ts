import { approvalDigest } from './config.js';
import { TOOL_BY_NAME } from './tools.js';

const [tool, json] = process.argv.slice(2);
if (!tool || !json) {
  console.error('Usage: npm run approve -- <tool-name> <json-arguments-without-approvalToken>');
  process.exit(2);
}

const def = TOOL_BY_NAME.get(tool);
if (!def || !def.approval) {
  console.error('Tool is unknown or does not require approval');
  process.exit(2);
}

const secret = process.env.SONARQUBE_APPROVAL_SECRET;
if (!secret) {
  console.error('SONARQUBE_APPROVAL_SECRET is required');
  process.exit(2);
}

let args: Record<string, unknown>;
try {
  const parsed = JSON.parse(json) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Arguments must be a JSON object');
  args = parsed as Record<string, unknown>;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}

delete args.approvalToken;
console.log(approvalDigest(secret, tool, args));
