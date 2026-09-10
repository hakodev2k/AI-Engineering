import crypto from "node:crypto";
import type { GcoreConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export const TOOLS = {
  "gcore.project.list": { upstream: "cloud.projs.ls", raw: "cloud.projects.list", risk: "READ" },
  "gcore.region.list": { upstream: "cloud.rgns.ls", raw: "cloud.regions.list", risk: "READ" },
  "gcore.instance.list": { upstream: "cloud.insts.ls", raw: "cloud.instances.list", risk: "READ" },
  "gcore.instance.get": { upstream: "cloud.insts.get", raw: "cloud.instances.get", risk: "READ" },
  "gcore.instance.create": { upstream: "cloud.insts.new", raw: "cloud.instances.create", risk: "WRITE" },
  "gcore.instance.update": { upstream: "cloud.insts.upd", raw: "cloud.instances.update", risk: "HIGH_RISK" },
  "gcore.instance.action": { upstream: "cloud.insts.action", raw: "cloud.instances.action", risk: "HIGH_RISK" },
  "gcore.instance.delete": { upstream: "cloud.insts.del", raw: "cloud.instances.delete", risk: "DESTRUCTIVE" },
  "gcore.volume.list": { upstream: "cloud.vols.ls", raw: "cloud.volumes.list", risk: "READ" },
  "gcore.network.list": { upstream: "cloud.nets.ls", raw: "cloud.networks.list", risk: "READ" },
  "gcore.security_group.list": { upstream: "cloud.secgrps.ls", raw: "cloud.security_groups.list", risk: "READ" },
  "gcore.ssh_key.list": { upstream: "cloud.sshkeys.ls", raw: "cloud.ssh_keys.list", risk: "READ" }
} as const satisfies Record<string, { upstream: string; raw: string; risk: Risk }>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function expectedApproval(secret: string, tool: string, args: Record<string, unknown>): string {
  const payload = { ...args };
  delete payload.approvalToken;
  return crypto.createHmac("sha256", secret).update(`${tool}\n${canonical(payload)}`).digest("hex");
}

export function authorize(config: GcoreConfig, tool: keyof typeof TOOLS, args: Record<string, unknown>): void {
  const risk = TOOLS[tool].risk;
  if (risk === "READ") return;
  if (risk === "WRITE" && !config.allowWrite) throw new Error("WRITE operations are disabled by operator policy");
  if (risk === "HIGH_RISK" && !config.allowHighRisk) throw new Error("HIGH_RISK operations are disabled by operator policy");
  if (risk === "DESTRUCTIVE" && !config.allowDestructive) throw new Error("DESTRUCTIVE operations are disabled by operator policy");
  if (!config.approvalSecret) throw new Error("GCORE_APPROVAL_SECRET is required for mutating tools");
  const provided = typeof args.approvalToken === "string" ? args.approvalToken : "";
  const expected = expectedApproval(config.approvalSecret, tool, args);
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("Explicit approval is required for this exact action");
}
