import type { ConnectorConfig } from "./config.js";

export type RiskLevel = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class ApprovalRequiredError extends Error {
  constructor(toolName: string) {
    super(`Explicit human approval is required for ${toolName}. Re-run with approved=true after the user approves the exact action.`);
    this.name = "ApprovalRequiredError";
  }
}

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

export function requireApproval(config: ConnectorConfig, toolName: string, approved: boolean): void {
  if (config.approvalRequired && !approved) {
    throw new ApprovalRequiredError(toolName);
  }
}

export function assertChannelAllowed(config: ConnectorConfig, channelId: string): void {
  if (config.allowedChannelIds.size > 0 && !config.allowedChannelIds.has(channelId)) {
    throw new PolicyError(`Channel ${channelId} is outside SLACK_ALLOWED_CHANNEL_IDS.`);
  }
}

export function safeText(value: string, field: string, maxLength = 4000): string {
  const text = value.trim();
  if (!text) throw new PolicyError(`${field} must not be empty.`);
  if (text.length > maxLength) throw new PolicyError(`${field} exceeds ${maxLength} characters.`);
  return text;
}
