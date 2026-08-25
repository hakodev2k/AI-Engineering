# Skill: Destructive Target Preflight

## Purpose
Establish a machine-verifiable contract between destructive intent and effective filesystem targets before execution.

## Trigger
Any proposed delete/recursive remove/cleanup command or delegated task that may remove filesystem content.

## Inputs
- Proposed command string.
- Current working directory.
- Allowed root paths.
- Exact authorized target paths.
- `config/policy.json`.

## Preconditions
The host has not executed the proposed command. Authorized targets come from the task scope, not from parsing the proposed command.

## Required context
Workspace identity, current path, user-approved scope, and whether explicit human destructive-action approval exists.

## Allowed tools
Read-only filesystem metadata, path canonicalization, the package scanner, and human-approval channel. No shell evaluation of the proposed command.

## Constraints
Do not expand shell expressions by execution. Do not assume full-access mode equals destructive approval. Treat parse ambiguity as unsafe.

## Procedure
1. Record the exact task-scoped targets and allowed roots.
2. Run `python scripts/destructive_guard.py --input <request.json> --policy config/policy.json`.
3. Inspect `decision`, normalized targets, and findings.
4. If `allow`, pass the unchanged command and target manifest to the executor.
5. If `review`, enumerate exact targets using a read-only mechanism and request explicit approval; re-run preflight with the new exact manifest.
6. If `block`, redesign the operation using a narrower command or recoverable deletion API.
7. After execution, verify only approved targets changed.

## Decision points
- Non-destructive command: pass without destructive authorization.
- Exact, non-recursive, in-root, intent-bound target: allow.
- Recursive delete or `git clean`: review.
- Wildcard, unresolved variable, command substitution, root target, outside-root target, or target mismatch: block.

## Expected output
JSON decision with findings and normalized candidate targets.

## Metrics
Count checks by decision and finding code; track false positives and any destructive incident after an `allow`.

## Verification
Unit tests must cover exact-target success and all blocked/review classes. Execution verifier must confirm postconditions independently.

## Failure handling
Scanner error or unsupported syntax returns non-zero and blocks automatic execution. Maximum remediation attempts: 2; after that escalate to human review.

## Stop conditions
Stop when the operation is allowed with an unchanged exact target manifest, the user cancels it, or the second remediation attempt still cannot produce an exact safe target set.
