# Skill: Destructive Target Preflight

## Purpose
Establish a machine-verifiable contract between destructive intent and exact filesystem targets before execution.

## Trigger
Any delete/cleanup operation or delegated task that may remove filesystem content.

## Inputs
- Structured operation (`delete` or `cleanup`).
- Current working directory.
- Candidate target paths.
- Allowed root paths.
- Exact authorized target paths.
- Whether the operation is recursive and/or recoverable.
- `config/policy.json`.

## Preconditions
The host has not executed the operation. Authorized targets originate from the task scope or explicit approval, never from the proposed implementation itself.

## Required context
Workspace identity, current path, user-approved scope, and whether explicit human destructive-action approval exists.

## Allowed tools
Read-only filesystem metadata, path canonicalization, `scripts/target_guard.py`, and a human-approval channel.

## Constraints
Do not evaluate shell expressions to discover targets. A shell adapter must first translate the intended destructive action into this structured contract. Do not assume full-access mode equals destructive approval.

## Procedure
1. Record task-scoped exact targets and allowed roots.
2. Convert the proposed destructive operation into structured fields without executing it.
3. Run `python scripts/target_guard.py --input <request.json> --policy config/policy.json`.
4. Inspect `decision`, normalized targets, and findings.
5. If `allow`, execute only an operation whose target set is unchanged from the validated request.
6. If `review`, enumerate exact descendants/targets read-only and request explicit approval; then rerun preflight.
7. If `block`, redesign with narrower exact targets or a recoverable deletion API.
8. After execution, independently verify only approved targets changed.

## Decision points
- Exact, non-recursive, recoverable, in-root, intent-bound target: allow.
- Recursive or unrecoverable operation: review unless a stronger host policy blocks it.
- Pattern/variable target, filesystem root, outside-root target, recursive allowed-root target, or target mismatch: block.

## Expected output
JSON decision with findings and normalized targets.

## Metrics
Count checks by decision and finding code; track false positives and any destructive incident after an `allow`.

## Verification
`python -m unittest tests/test_target_guard.py` must pass. Execution verification is independent from implementation.

## Failure handling
Scanner error or unsupported/invalid structured input blocks automatic execution. Maximum remediation attempts: 2, then escalate to human review.

## Stop conditions
Stop when the operation is allowed with an unchanged exact target manifest, the user cancels it, or the second remediation attempt still cannot produce a safe exact target set.
