import { createHmac } from "node:crypto";

const [tool, json] = process.argv.slice(2);
const secret = process.env.COCKROACH_CLOUD_APPROVAL_SECRET;
if (!tool || !json || !secret) {
  console.error("Usage: COCKROACH_CLOUD_APPROVAL_SECRET=... node examples/create-approval.mjs <tool> '<json>'");
  process.exit(1);
}
if (secret.length < 16) throw new Error("Approval secret must contain at least 16 characters");

const input = JSON.parse(json);
delete input.approvalId;

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

const digest = createHmac("sha256", secret).update(`${tool}\n${canonical(input)}`).digest("hex");
process.stdout.write(`${digest}\n`);
