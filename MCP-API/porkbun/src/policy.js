import crypto from "node:crypto";

export const RISK = Object.freeze({ READ: "READ", WRITE: "WRITE", HIGH_RISK: "HIGH_RISK", DESTRUCTIVE: "DESTRUCTIVE" });

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret, toolName, args) {
  const payload = { ...args };
  delete payload.approval_token;
  return crypto.createHmac("sha256", secret).update(`${toolName}\n${canonical(payload)}`).digest("hex");
}

export function enforcePolicy(config, tool, args) {
  if (tool.risk === RISK.READ) return;
  if (tool.risk === RISK.DESTRUCTIVE && !config.enableDestructive) {
    throw new Error("DESTRUCTIVE_DISABLED: enable explicitly outside the agent with PORKBUN_ENABLE_DESTRUCTIVE=true");
  }
  const approvalRequired = tool.risk === RISK.HIGH_RISK || tool.risk === RISK.DESTRUCTIVE || config.requireWriteApproval;
  if (!approvalRequired) return;
  if (!config.approvalSecret) throw new Error("APPROVAL_CONFIGURATION_REQUIRED");
  const supplied = args.approval_token;
  if (typeof supplied !== "string" || !/^[a-f0-9]{64}$/.test(supplied)) throw new Error("HUMAN_APPROVAL_REQUIRED");
  const expected = approvalDigest(config.approvalSecret, tool.name, args);
  const a = Buffer.from(supplied, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("INVALID_APPROVAL");
}
