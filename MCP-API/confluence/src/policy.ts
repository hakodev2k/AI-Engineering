export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export type ToolPolicy = {
  risk: Risk;
  approvalRequired: boolean;
};

export const TOOL_POLICIES: Record<string, ToolPolicy> = {
  "confluence.space.list": { risk: "READ", approvalRequired: false },
  "confluence.page.list": { risk: "READ", approvalRequired: false },
  "confluence.page.get": { risk: "READ", approvalRequired: false },
  "confluence.page.search": { risk: "READ", approvalRequired: false },
  "confluence.page.descendants": { risk: "READ", approvalRequired: false },
  "confluence.comment.footer.list": { risk: "READ", approvalRequired: false },
  "confluence.comment.inline.list": { risk: "READ", approvalRequired: false },
  "confluence.page.create": { risk: "WRITE", approvalRequired: true },
  "confluence.page.update": { risk: "WRITE", approvalRequired: true },
  "confluence.comment.footer.create": { risk: "WRITE", approvalRequired: true },
  "confluence.comment.inline.create": { risk: "WRITE", approvalRequired: true }
};

export function enforcePolicy(tool: string, approved: boolean | undefined, requireWriteApproval = true): void {
  const policy = TOOL_POLICIES[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.approvalRequired && requireWriteApproval && approved !== true) {
    throw new Error(`APPROVAL_REQUIRED: ${tool}`);
  }
}
