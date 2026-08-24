# Research — Approval Evidence Integrity Guard

## Topic
Approval subject, scope, and rationale integrity across agent UIs

## Category
Security

## Problem
AI coding-agent approval systems can technically request confirmation while failing to show the user the exact action, target, permission scope, or security rationale needed for an informed decision. The approval event exists, but the human-visible evidence is incomplete or missing.

## Why it matters now
Recent 2026 reports show this failure across multiple products and surfaces. A confirmation prompt that hides the subject or rationale weakens the approval boundary even when the backend policy is correct.

## Affected users
Developers using coding agents, security teams relying on approval hooks, platform builders implementing delegated approval, and teams using remote/mobile approval surfaces.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #85950, opened 2026-08-11, reports that `permissionDecisionReason` from a PreToolUse hook is omitted from the VS Code approval UI even though the reason appears in other Claude surfaces. The report explicitly describes the reason as the safety payload of the decision. https://github.com/anthropics/claude-code/issues/85950
2. OpenAI Codex issue #36637, opened 2026-08-02, reports file-change approval dialogs that can offer approval without identifying the action or target when `reason` is absent. https://github.com/openai/codex/issues/36637
3. OpenAI Codex issue #39346, opened 2026-08-19, reports remote/mobile state that says an approval is waiting but presents no actionable approval card, command detail, justification, or Approve/Deny controls. https://github.com/openai/codex/issues/39346
4. OpenAI Codex issue #32981, opened 2026-07-14, reports that Auto-review status can be shown without the reviewer rationale, making automated approval decisions difficult to audit. https://github.com/openai/codex/issues/32981
5. MCP 2026-07-28 tools guidance says clients SHOULD show tool inputs before sensitive calls and prompt for confirmation on sensitive operations. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Existing approaches
- Product-specific approval dialogs.
- Hook-provided reason strings.
- CLI or desktop views that show command/tool metadata.
- Auto-review status indicators.
- Audit logs that preserve some approval events.

## Remaining limitations
- Backend decisions and frontend rendering are not always tested as one end-to-end security invariant.
- A reason can be lost while the action remains approvable.
- An approval can expose a generic status without the concrete permission scope or target.
- Cross-device surfaces can disagree about whether an approval is actionable.
- Automated reviewers may preserve outcome but drop rationale and risk metadata.

## Root-cause analysis
1. Approval producers, transport schemas, and UI renderers are owned by different layers.
2. Optional fields become de facto security-critical without being enforced as required at the final decision point.
3. Tests often verify that an approval event is emitted, not that the human sees decision-grade evidence.
4. Generic approval components accept malformed or incomplete requests instead of failing closed.
5. Audit records may preserve less information than the policy engine used to decide.

## Interpretation
The security boundary is not merely “an approval occurred.” A valid affirmative approval requires a visible subject, target, scope, and rationale sufficient to understand what will happen. Missing evidence should invalidate the affirmative path rather than silently degrade the dialog.

## Improvement opportunity
Define a product-agnostic approval evidence contract and deterministic pre-render validator. Block affirmative choices when required decision evidence is absent; record structured diagnostics; verify parity between policy output, transport payload, rendered UI, and audit log.

## Proposed solution
This package adds an explicit approval evidence schema, security rules, a reusable review skill, an independent verifier subagent, a bounded implementation workflow, a deterministic pre-render hook, and a dependency-free validator script with tests.

## Goal
Every affirmative approval must be bound to visible, auditable action evidence.

## Metrics
- `% affirmative approvals with action + target + scope + rationale`.
- `% approval events whose rendered evidence matches policy output`.
- Cross-surface parity failures per release.
- Blank/generic approval prompts detected.
- Audit-record evidence loss rate.

## Trigger
Any human or automated approval request before a privileged, irreversible, external, repository-mutating, or permission-expanding action.

## Inputs
Approval decision payload, action/tool identifier, target, requested scope, rationale/risk context, human-visible rendering snapshot or normalized UI event, audit record.

## Outputs
Pass/fail decision, missing-evidence diagnostics, normalized approval record, parity report.

## Verification
The guard is verified only when malformed affirmative requests are blocked, complete requests pass, rendered evidence is compared against source policy data, and tests confirm fail-closed behavior.
