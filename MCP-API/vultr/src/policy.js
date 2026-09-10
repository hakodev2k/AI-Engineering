import { createHmac, timingSafeEqual } from "node:crypto";

export const RISK = Object.freeze({ READ: "READ", WRITE: "WRITE", HIGH_RISK: "HIGH_RISK", DESTRUCTIVE: "DESTRUCTIVE" });

export const TOOL_RISKS = Object.freeze({
  "vultr.instance.list": RISK.READ,
  "vultr.instance.get": RISK.READ,
  "vultr.region.list": RISK.READ,
  "vultr.region.availability": RISK.READ,
  "vultr.plan.list": RISK.READ,
  "vultr.os.list": RISK.READ,
  "vultr.ssh_key.list": RISK.READ,
  "vultr.firewall_group.list": RISK.READ,
  "vultr.firewall_rule.list": RISK.READ,
  "vultr.snapshot.list": RISK.READ,
  "vultr.instance.tags.update": RISK.WRITE,
  "vultr.instance.create": RISK.HIGH_RISK,
  "vultr.instance.reboot": RISK.HIGH_RISK,
  "vultr.snapshot.create": RISK.HIGH_RISK,
  "vultr.instance.delete": RISK.DESTRUCTIVE,
  "vultr.snapshot.delete": RISK.DESTRUCTIVE
});

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function payloadWithoutApproval(input) {
  const { approvalToken, ...payload } = input || {};
  return payload;
}

export function approvalDigest(secret, toolName, input) {
  return createHmac("sha256", secret).update(`${toolName}\n${canonical(payloadWithoutApproval(input))}`).digest("hex");
}

function validDigest(expected, supplied) {
  if (!supplied || !/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(supplied, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function assertPermission(toolName, input, config) {
  const risk = TOOL_RISKS[toolName];
  if (!risk) throw new Error(`Unknown tool policy: ${toolName}`);
  if (risk === RISK.READ) return;
  if (risk === RISK.HIGH_RISK && !config.enableHighRisk) throw new Error("HIGH_RISK operations are disabled; set VULTR_ENABLE_HIGH_RISK=true outside the agent context");
  if (risk === RISK.DESTRUCTIVE && !config.enableDestructive) throw new Error("DESTRUCTIVE operations are disabled; set VULTR_ENABLE_DESTRUCTIVE=true outside the agent context");
  const approvalRequired = risk === RISK.HIGH_RISK || risk === RISK.DESTRUCTIVE || config.requireWriteApproval;
  if (!approvalRequired) return;
  if (!config.approvalSecret || config.approvalSecret.length < 16) throw new Error("VULTR_APPROVAL_SECRET must be at least 16 characters for approval-gated operations");
  const expected = approvalDigest(config.approvalSecret, toolName, input);
  if (!validDigest(expected, input?.approvalToken)) throw new Error("Explicit human approval for this exact tool payload is required");
}
