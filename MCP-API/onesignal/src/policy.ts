import type { ConnectorConfig } from "./auth.js";
import type { Risk, ToolPolicy } from "./types.js";

export const TOOL_POLICIES: ToolPolicy[] = [
  { externalName: "onesignal.app.list", upstreamName: "list_apps", risk: "READ", purpose: "List apps accessible to the authenticated OneSignal user." },
  { externalName: "onesignal.message.list", upstreamName: "list_messages", risk: "READ", purpose: "List recent OneSignal messages." },
  { externalName: "onesignal.message.get", upstreamName: "view_message", risk: "READ", purpose: "Read message details and delivery statistics." },
  { externalName: "onesignal.message.send", upstreamName: "send_message", risk: "HIGH_RISK", purpose: "Send push, email, or SMS through OneSignal." },
  { externalName: "onesignal.user.get", upstreamName: "view_user", risk: "READ", purpose: "Look up a OneSignal user by alias." },
  { externalName: "onesignal.user.identity.get", upstreamName: "get_user_identity", risk: "READ", purpose: "Read a user's identity aliases." },
  { externalName: "onesignal.user.identity.get_by_subscription", upstreamName: "get_user_identity_by_subscription", risk: "READ", purpose: "Resolve identity from a subscription ID." },
  { externalName: "onesignal.user.create", upstreamName: "create_user", risk: "WRITE", purpose: "Create a OneSignal user." },
  { externalName: "onesignal.user.update", upstreamName: "update_user", risk: "WRITE", purpose: "Update user properties such as tags or language." },
  { externalName: "onesignal.subscription.create", upstreamName: "create_subscription", risk: "WRITE", purpose: "Create a push, email, or SMS subscription." },
  { externalName: "onesignal.subscription.update", upstreamName: "update_subscription", risk: "WRITE", purpose: "Update an existing subscription." },
  { externalName: "onesignal.template.list", upstreamName: "list_templates", risk: "READ", purpose: "List message templates." },
  { externalName: "onesignal.template.get", upstreamName: "get_template", risk: "READ", purpose: "Read a message template." },
  { externalName: "onesignal.segment.list", upstreamName: "list_segments", risk: "READ", purpose: "List audience segments." },
  { externalName: "onesignal.segment.get", upstreamName: "get_segment", risk: "READ", purpose: "Read a segment and its filters." },
  { externalName: "onesignal.analytics.outcomes.get", upstreamName: "view_outcomes", risk: "READ", purpose: "Read outcome analytics." }
];

export const BY_EXTERNAL = new Map(TOOL_POLICIES.map((p) => [p.externalName, p]));

export function assertApproved(risk: Risk, approved: boolean, config: ConnectorConfig): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE") throw new Error("Destructive operations are not exposed by this connector");
  if (risk === "HIGH_RISK") {
    if (!config.allowHighRisk) throw new Error("High-risk actions are disabled; operator must set ONESIGNAL_ALLOW_HIGH_RISK=true");
    if (!approved) throw new Error("Explicit human approval is required for this high-risk action");
    return;
  }
  if (config.requireWriteApproval && !approved) {
    throw new Error("Explicit human approval is required for this write action");
  }
}
