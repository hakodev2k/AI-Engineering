# Effective Sandbox Preflight Skill

## Purpose
Verify that a requested filesystem mutation respects protected logical paths even when the destination does not yet exist.

## Trigger
Before create, write, patch, delete, move, rename, link, or tool execution capable of those operations.

## Inputs
Workspace root, requested source/destination paths, operation, protected-path policy, effective sandbox mode.

## Preconditions
Policy is supplied from trusted host configuration; workspace identity is known; native sandbox remains enabled.

## Required context
Only path metadata and operation type. File contents are not required.

## Allowed tools
Filesystem metadata/readlink equivalents, policy parser, `scripts/protected_path_guard.py`.

## Constraints
Do not materialize missing paths. Do not mutate ACLs. Do not follow a symlink outside the workspace and then treat the lexical path as safe.

## Procedure
1. Normalize workspace root to an absolute canonical base.
2. Normalize requested path lexically under the workspace; resolve existing ancestors where possible.
3. Reject traversal/out-of-workspace targets.
4. Convert target to normalized workspace-relative form.
5. Compare against every protected prefix; descendant match is deny.
6. For move/rename, repeat for source and destination.
7. Emit deterministic decision and matched rule.
8. Run native sandbox operation only after allow.

## Decision points
- Invalid policy/input -> block.
- Outside workspace -> block unless a separate trusted policy explicitly authorizes it.
- Protected prefix match -> block.
- No match -> allow this guard; native sandbox still decides final authorization.

## Expected output
`decision`, `operation`, `canonical_target`, `matched_rule`, `reason`.

## Metrics
Protected fixture coverage, false-positive rate, number of policy/runtime mismatches.

## Verification
Run tests with each protected path absent and present. Independently verify native sandbox denial for representative protected targets.

## Failure handling
Retry policy reload once if the policy file changed during evaluation. Otherwise stop and escalate.

## Stop conditions
Stop immediately on malformed policy, escaping target, or protected prefix match. Never retry a blocked mutation autonomously.
