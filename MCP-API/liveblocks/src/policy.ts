export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export type PolicyConfig = {
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, config: PolicyConfig): void {
  if (risk === "READ") return;
  if (risk === "DESTRUCTIVE" && !config.destructiveEnabled) {
    throw new Error("DESTRUCTIVE_DISABLED");
  }
  if (config.requireWriteApproval && approved !== true) {
    throw new Error("APPROVAL_REQUIRED");
  }
}

export function loadPolicy(env = process.env): PolicyConfig {
  return {
    requireWriteApproval: (env.LIVEBLOCKS_REQUIRE_WRITE_APPROVAL ?? "true") !== "false",
    destructiveEnabled: env.LIVEBLOCKS_ENABLE_DESTRUCTIVE === "true",
  };
}
