# Skill: Execution Environment Rebinding Audit

## Purpose
Determine whether a persisted agent thread can be safely rebound from one execution environment to another without stale filesystem or permission state.

## Trigger
Runtime/host/workspace/shell/sandbox changes, especially Windows-native <-> WSL.

## Inputs
Structured exports of thread state, global state, rollout/world-state, source and target environment descriptors, path mappings, expected project root.

## Preconditions
All writes are disabled. Active agent/app processes that may mutate state are stopped or state is captured from a consistent snapshot.

## Required context
Canonical workspace identity, source/target filesystem namespaces, allowed writable roots, shell family, permission policy.

## Allowed tools
Read-only file/DB export tools, JSON parsers, path validators, `scripts/rebinding_audit.py`.

## Constraints
Never rewrite opaque conversation text globally. Never broaden writable roots to make migration pass. Never treat syntactic path conversion as proof of permission equivalence.

## Procedure
1. Capture a backup/snapshot identifier and source-environment descriptor.
2. Inventory every structured environment-sensitive value: cwd, workspace roots, writable roots, sandbox roots, permission profiles, shell, host-skill paths, project binding, turn/world-state roots.
3. Normalize values into `(source, semantic role, path/runtime family)` records.
4. Apply only explicit source->target mappings.
5. Flag unmapped absolute paths, mixed path families, malformed drive/mount conversions, target paths outside canonical workspace scope, and stale shell/runtime metadata.
6. Compare effective writable/sandbox roots before and after mapping. Target permissions MUST be equal or narrower unless separately approved.
7. Produce a migration plan grouped by store and field.
8. Validate the proposed target state with the deterministic audit script before any mutation.
9. After implementation by another component, rerun the audit against the exported post-state.

## Decision points
- Missing mapping: block.
- Mixed runtime provenance remains: block.
- Permission scope expands: block and require explicit human approval.
- Target path cannot be resolved/validated: block.
- Conversation content contains historical path strings but structured execution state is clean: report informationally; do not rewrite prose automatically.

## Expected output
Findings, safe/unsafe verdict, mapped/unmapped inventory, permission-delta report, migration plan, verification checklist.

## Metrics
Unmapped path count; mixed-family count; stale permission-root count; permission expansions; post-migration resume success; rollback success.

## Verification
All structured execution fields match target runtime, no unmapped critical paths remain, permission scope is not broadened, project root and sandbox roots agree, and a resume preflight succeeds.

## Failure handling
Preserve source snapshot, reject migration, emit exact offending fields. Maximum two mapping-plan revisions before escalation.

## Stop conditions
Any destructive/irreversible mutation without backup, ambiguous permission expansion, unsupported path mapping, or two failed verification attempts.