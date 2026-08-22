# Skill: Path Rebinding Threat Model

## Purpose
Validate filesystem authority when migrating agent state between path namespaces such as Windows and WSL.

## Trigger
Execution-environment switch, project rebind, session migration, sandbox-policy schema migration, or any persisted-root translation.

## Inputs
Source environment, destination environment, approved destination roots, path mappings, and all persisted `cwd`/workspace/writable/sandbox/permission paths.

## Preconditions
Agent execution is stopped or migration is staged against a copy. Approved destination roots are explicit.

## Required context
Trust boundary, project root, writable-root policy, protected paths, and migration rollback location.

## Allowed tools
Read-only state inspection, deterministic path canonicalizer/auditor, backup tooling, schema validators.

## Constraints
MUST fail closed for ambiguous/unmapped roots. MUST NOT broaden permissions to make migration succeed. MUST NOT infer a drive mapping when it is not explicitly established.

## Procedure
1. Inventory every security-relevant path representation.
2. Normalize separators/case without changing path identity.
3. Map source roots to explicitly approved destination roots.
4. Reject malformed mixed-namespace paths.
5. Verify every writable/sandbox root is equal to or contained by an approved destination root.
6. Verify protected paths did not enter the allow-set.
7. Compare SQLite/global/rollout/policy representations for convergence.
8. Stage migration, audit again, then permit atomic commit.

## Decision points
Any ambiguous mapping, outside-root result, mixed namespace, or store disagreement blocks migration.

## Expected output
Path inventory, canonical mappings, violations, trust-boundary decision, and rollback requirement.

## Metrics
Unmapped roots, mixed-namespace roots, outside-approved roots, cross-store mismatches, policy roots broadened, migration pass rate, rollback rate.

## Verification
Independent verifier reruns the audit on staged and committed state and confirms effective permissions are no broader than the approved destination policy.

## Failure handling
Keep original state untouched, restore staged copy, record violations, and require explicit mapping/approval. Maximum one corrected migration attempt before escalation.

## Stop conditions
Unknown path identity, missing backup, active writers, security-root mismatch, or failed post-commit verification.