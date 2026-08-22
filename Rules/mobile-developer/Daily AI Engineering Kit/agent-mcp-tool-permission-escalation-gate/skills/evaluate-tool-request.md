# Skill: Evaluate MCP Tool Request

## Purpose
Evaluate an agent tool request against least-privilege policy before invocation.

## When to use
Use before every MCP or external tool call that can read sensitive data, write state, change permissions, deploy, delete, or access production resources.

## Inputs
- Tool name and action.
- Exact resource scope.
- Business/engineering reason.
- Risk classification.
- Requested elevation duration when applicable.
- Existing human approval evidence when required.

## Preconditions
- Repository/task context is known.
- The requested tool and resources are identifiable.
- `config/policy.yaml` is available.

## Allowed tools
Read-only repository inspection, policy lookup, schema validation, and `scripts/permission_gate.py`.

## Constraints
- Default deny when required context is missing.
- Never infer approval from urgency, prior approvals, or agent intent.
- Never broaden resource scope to make the request pass.

## Procedure
1. Normalize the request into `schemas/tool-request.schema.json` fields.
2. Confirm action and risk match actual side effects, not the agent's description.
3. Replace broad scopes with the smallest concrete resources possible; if scope cannot be narrowed, stop.
4. Run `python scripts/permission_gate.py <request.json>`.
5. If the gate requires approval, create an approval request using `templates/approval-request.md` and stop execution.
6. After independent approval is recorded, rerun with `--approved --approval-id <id>`.
7. Execute only the approved tool/action/resources and nothing else.
8. Preserve gate output, approval identifier, and execution evidence.

## Expected output
A deterministic `allowed` or `denied` decision plus reason/evidence.

## Verification
Confirm the executed tool, action, and resources exactly match the approved request. Any difference invalidates the approval.

## Failure handling
Validation/tool failures may be retried at most twice when transient. Permission failures are not retryable without changed evidence or approval.

## Stop conditions
Stop on missing scope, wildcard scope, missing required approval, expired elevation, or policy mismatch.
