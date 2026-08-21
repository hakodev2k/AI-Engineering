# Capture Reviewed Command Intent

## Purpose
Create the immutable, reviewable command contract before an agent performs a meaningful tool action.

## Use when
Use before remote writes, destructive commands, deployments, migrations, infrastructure changes, repository history changes, security changes, or any command whose target/flags/environment materially affect risk.

## Inputs
- requested outcome
- exact executable/tool
- argument list
- target resource
- environment
- side-effect class
- risk level
- applicable approval action
- repository/task evidence supporting the command

## Preconditions
- the intended operation is understood well enough to name its target and side effects;
- secrets are referenced, not embedded;
- required context has been read from authoritative repository/config/tool sources.

## Allowed tools
Read-only repository inspection, documentation lookup, dry-run/plan commands, deterministic fingerprint script.

## Constraints
- Do not execute the reviewed command while building the intent contract.
- Do not hide dangerous behavior inside shell interpolation, aliases, scripts, or environment variables.
- Represent arguments as discrete strings rather than a single opaque shell command whenever possible.

## Procedure
1. State the desired outcome and evidence supporting the operation.
2. Resolve the concrete executable/tool and target resource.
3. Enumerate arguments explicitly, including flags whose defaults affect safety.
4. Classify `side_effect` as `read-only`, `local-write`, `remote-write`, or `destructive`.
5. Assign `risk` as `low`, `medium`, `high`, or `critical`.
6. Map the operation to `approval_action` when it falls under a mandatory human approval boundary.
7. Record constraints such as allowed resource, branch, namespace, database, tenant, or environment.
8. Save the contract using `schemas/command-intent.schema.json`.
9. Run `scripts/fingerprint-intent.py --intent <intent.json> --policy config/intent-policy.json`.
10. For high/critical risk, obtain independent review before execution.
11. Preserve the exact intent fingerprint with the review record.

## Expected output
A valid command intent plus its fingerprint and, when required, an approved `intent-review` record.

## Verification
Verify executable, arguments, target, environment, side-effect class and approval action against source evidence. Fingerprint again immediately before execution.

## Failure handling
If target, semantics, environment, or approval boundary is uncertain, mark the command unready and stop. Re-plan at most once after collecting new evidence.

## Stop conditions
Stop before execution if the command cannot be represented without hidden behavior, required approval is missing, or authoritative target/environment cannot be established.
