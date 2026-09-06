import type { Config, Risk } from "./config.js";

export interface ToolPolicy {
  upstream: string;
  external: string;
  risk: Risk;
}

const read = (upstream: string, external: string): ToolPolicy => ({ upstream, external, risk: "READ" });
const write = (upstream: string, external: string): ToolPolicy => ({ upstream, external, risk: "WRITE" });

export const POLICIES: ToolPolicy[] = [
  read("search_spaces", "wrike.space.search"),
  read("get_items_children", "wrike.item.children.read"),
  read("get_my_inbox", "wrike.inbox.read"),
  read("search_items", "wrike.item.search"),
  read("search_users", "wrike.user.search"),
  read("get_users", "wrike.user.get"),
  read("get_item_details", "wrike.item.read"),
  read("get_item_comments", "wrike.item.comments.read"),
  write("create_task_item", "wrike.task.create"),
  write("create_project_folder_item", "wrike.project_folder.create"),
  write("update_items", "wrike.item.update"),
  write("create_item_comment", "wrike.item.comment.create"),
  read("search_workflows", "wrike.workflow.search"),
  read("search_customitemtypes", "wrike.custom_item_type.search"),
  read("search_item_customfields", "wrike.custom_field.search"),
  read("get_approvals", "wrike.approval.read"),
  read("search_approvals", "wrike.approval.search")
];

export const BY_EXTERNAL = new Map(POLICIES.map(p => [p.external, p]));
export const BY_UPSTREAM = new Map(POLICIES.map(p => [p.upstream, p]));

export function authorize(policy: ToolPolicy, args: Record<string, unknown>, config: Config): Record<string, unknown> {
  if (!config.allowedRisks.has(policy.risk)) throw new Error(`${policy.risk} operations are disabled by connector policy.`);
  const bytes = Buffer.byteLength(JSON.stringify(args), "utf8");
  if (bytes > config.maxInputBytes) throw new Error(`Tool input exceeds ${config.maxInputBytes} bytes.`);

  const forwarded = { ...args };
  const approval = forwarded.approvalToken;
  delete forwarded.approvalToken;

  if (policy.risk === "WRITE") {
    if (!config.approvalToken) throw new Error("WRITE tools require WRIKE_APPROVAL_TOKEN to be configured.");
    if (approval !== config.approvalToken) throw new Error("Explicit human approval is required for this WRITE operation.");
  }
  return forwarded;
}
