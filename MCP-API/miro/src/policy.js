import crypto from "node:crypto";

const POLICY = Object.freeze({
  "miro.board.list": {risk: "READ", approval: false},
  "miro.board.get": {risk: "READ", approval: false},
  "miro.board.create": {risk: "WRITE", approval: true},
  "miro.board.items.list": {risk: "READ", approval: false},
  "miro.board.item.get": {risk: "READ", approval: false},
  "miro.board.members.list": {risk: "READ", approval: false},
  "miro.sticky_note.create": {risk: "WRITE", approval: true},
  "miro.sticky_note.update": {risk: "WRITE", approval: true},
  "miro.sticky_note.delete": {risk: "DESTRUCTIVE", approval: true},
  "miro.text.create": {risk: "WRITE", approval: true},
  "miro.text.update": {risk: "WRITE", approval: true},
  "miro.text.delete": {risk: "DESTRUCTIVE", approval: true},
  "miro.shape.create": {risk: "WRITE", approval: true},
  "miro.shape.update": {risk: "WRITE", approval: true},
  "miro.shape.delete": {risk: "DESTRUCTIVE", approval: true}
});

export { POLICY };

export function authorize(config, toolName, payload, approvalToken) {
  const policy = POLICY[toolName];
  if (!policy) throw new Error(`Unknown tool: ${toolName}`);

  if (policy.risk === "DESTRUCTIVE" && !config.destructiveEnabled) {
    throw new Error(`${toolName} is disabled; set MIRO_ENABLE_DESTRUCTIVE=true`);
  }
  if (!policy.approval) return;

  if (!config.approvalSecret) throw new Error(`${toolName} requires MIRO_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${toolName} requires explicit approval_token`);

  const expected = approvalDigest(config.approvalSecret, toolName, payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(approvalToken);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${toolName}`);
  }
}

export function approvalDigest(secret, toolName, payload) {
  return crypto.createHmac("sha256", secret)
    .update(`${toolName}\n${stable(payload)}`)
    .digest("hex");
}

function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
