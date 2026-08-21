# Workflow: MCP Tool Permission Least-Privilege Gate

## Trigger
New MCP server/tool, changed agent permissions, new integration, elevated task, security review, or unexpected tool access.

## Entry conditions
Task intent and target environment are known. Read-only inspection is available.

## Inputs
Repository/tool configuration, runtime tool metadata, task acceptance criteria, `config/policy.json`.

## Stages
1. **Inventory** — Permission Auditor runs `skills/permission-inventory.md` and captures effective capabilities.
2. **Plan** — Least-Privilege Planner runs `skills/least-privilege-plan.md` and minimizes scopes per stage.
3. **Policy validation** — run `python scripts/check-permissions.py --policy config/policy.json --requests <requests.json>`.
4. **Approval checkpoint** — human approval is mandatory before any risk classified as write, destructive, production, secret, permission-change, or external-publish.
5. **Execute** — implementation agent invokes only approved tools with bounded arguments.
6. **Collect evidence** — preserve tool name, normalized action, resource, result status, approval ID where required, and resulting diff/state.
7. **Verify** — Permission Verifier independently compares planned, configured, and effective permissions.
8. **Revoke/expire** — confirm temporary grants ended where the platform supports it.

## Checkpoints
- Unknown tools/scopes: block.
- Wildcard scope without demonstrated need: block.
- Missing approval for high-risk action: block.
- Tool arguments outside approved resource boundary: block.
- Effective permission broader than planned: fail verification.

## Retry rules
Maximum 2 retries, only for transient metadata/audit/tool-read failures. Preserve previous errors. Permission denial, policy failure, invalid schema, or missing approval are not retryable.

## Failure paths
- Tool metadata unavailable: classify unknown and stop.
- Permission denied: request the exact narrow permission; do not broaden automatically.
- Approval denied: stop affected stage and preserve completed read-only evidence.
- Verification discrepancy: mark failed and require remediation before completion.

## Approval points
Required before permission grants, writes, destructive actions, production operations, secret access/change, deployments, infrastructure/config changes, force push, external publishing, or security-control weakening.

## Definition of Done
- Inventory covers every enabled task-relevant tool.
- Required scopes are minimal and argument-bounded.
- Policy validation passes.
- All high-risk operations have explicit approval evidence.
- Effective permissions match or are narrower than the plan.
- Temporary capabilities are revoked/expired when supported.
- No unknown or blocking excess permission remains.
