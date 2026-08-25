# Skill — Privileged Configuration Review

## Purpose
Determine whether an agent-proposed file change creates or expands a future code-execution capability and produce an approval-ready evidence record.

## Trigger
Before any agent write to agent/editor/task/hook/workflow configuration, and again before such configuration is consumed.

## Inputs
Repository root, target path, proposed complete content, current content if present, trust/approval context.

## Preconditions
The proposed content is available as data; no project-local hook has been executed; reviewer has read-only access sufficient to inspect the target.

## Required context
Applicable workspace boundaries, host permission mode, known executable configuration locations, intended task scope.

## Allowed tools
Static file read, diff, hashing, `python scripts/config_guard.py`, repository history inspection.

## Constraints
Do not source/evaluate configuration. Do not reveal secrets. Do not infer approval from broad workspace trust. Do not approve based only on filename.

## Procedure
1. Record target path and whether it already exists.
2. Run the guard against proposed full content and capture decision, digest and indicators.
3. Diff current versus proposed content; isolate fields that register commands, hooks, tools, tasks or executable interpreters.
4. State the requested capability change in observable terms: trigger, command/interpreter, accessible data, write/network scope, and when it executes.
5. If privileged, obtain content-bound approval for the exact digest. A stale or path-only approval is insufficient.
6. Re-run the guard with the approved digest; require ALLOW before write.
7. After write, recompute the on-disk digest and require equality with the approved digest.
8. Hand off to an independent verifier before any new lifecycle hook is enabled.

## Decision points
- No privileged path/content indicators: ordinary write policy applies.
- Privileged but no exact approval: block.
- Exact approval but on-disk digest differs: block and re-review.
- New shell/lifecycle execution: require explicit human approval and independent verification.

## Expected output
Path, old/new digest, detected indicators, capability delta, approval status, verification status, risks.

## Metrics
Blocked unapproved writes, stale approvals detected, verification failures, false positives, time-to-review.

## Verification
Run `python -m unittest tests/test_config_guard.py`; verify exact-content approval passes and mutated content is blocked.

## Failure handling
On parser ambiguity or unsupported format, classify as privileged and escalate to manual review. Do not downgrade to allow.

## Stop conditions
Stop when the decision is deterministic and verified, or when required approval/review is unavailable. Maximum one re-review after content changes; further changes require a fresh approval cycle.
