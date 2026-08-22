# Capture Approval Context

## Purpose
Create a deterministic approval boundary before an agent requests human approval for a risky action.

## Use when
Use immediately before requesting approval for production changes, destructive operations, breaking changes, secret/config/infrastructure changes, irreversible migrations, force-push/history rewrites, or any action classified high/critical.

## Inputs
- Task identifier and risk level.
- Exact repository revision.
- Final executable plan.
- Exact resources/targets.
- Exact command or tool action set.
- Effective permission set.
- Target environment.
- Actor that will execute.

## Preconditions
The plan is executable, resources are identified, and no unresolved blocking evidence remains.

## Allowed tools
Read-only repository/config inspection, hashing, diff inspection, policy readers, and the scripts in this package.

## Constraints
Do not broaden resources, permissions, commands, or environment after approval. Never infer approval from silence.

## Procedure
1. Freeze the task id, risk, action type, environment, actor, and repository revision.
2. Canonicalize the final plan and SHA-256 hash it into `plan_fingerprint`.
3. Canonicalize the exact resources into `resource_fingerprint`.
4. Canonicalize intended commands/tool calls into `command_fingerprint`.
5. Canonicalize effective scopes/permissions into `permission_fingerprint`.
6. Set `dangerous_action=true` when the action crosses an approval boundary.
7. Save the context using `schemas/approval-context.schema.json` semantics.
8. Run `python3 scripts/fingerprint-context.py <context.json>`.
9. Present the human approver with the action plus the exact context fingerprint.
10. Save approval using the returned fingerprint; do not edit the context afterward.

## Expected output
A context JSON and approval record bound to the same SHA-256 context fingerprint.

## Verification
Recompute the fingerprint immediately before execution. The value must equal the approval record fingerprint.

## Failure handling
Missing fields or unknown resource/permission state blocks approval. A transient read/tool failure may be retried once; deterministic validation failure is not retried.

## Stop conditions
Stop if plan/resources/commands/permissions are not stable, production target is ambiguous, permissions exceed least privilege, or approval cannot be bound to an exact fingerprint.
