# Skill: Context Freshness Audit

## Purpose
Prove whether delegated work will start from the current project instruction/memory state.

## Trigger
Before subagent spawn/resume, after instruction or memory edits, and after rewind/recovery.

## Inputs
Repository root, critical context paths, epoch manifest.

## Preconditions
Critical paths are explicit and readable; repository root is known.

## Required context
Critical-file policy plus current filesystem state.

## Allowed tools
Read-only filesystem access, hashing, and `scripts/context_epoch_guard.py`.

## Constraints
Never execute context files, infer freshness from model claims, or print file contents/secrets.

## Procedure
1. Define the critical file set.
2. Capture an epoch with `snapshot`.
3. Immediately before delegation run `check`.
4. If fresh, record the epoch and proceed.
5. If stale, record changed paths, refresh via a host-supported mechanism, capture a new epoch, then recheck.
6. Retry refresh/recheck at most twice.
7. Hand evidence to the independent verifier.

## Decision points
Fresh: proceed. Drift: block and refresh. Invalid/unreadable input: fail closed.

## Expected output
Fresh/stale status, changed paths, epoch manifest, verification status.

## Metrics
Blocked stale spawns, refresh retries, refresh latency, stale-context rework.

## Verification
Run unit tests and mutate a critical fixture between snapshot and check.

## Failure handling
Preserve evidence and the previous manifest; never shrink the critical set merely to pass.

## Stop conditions
Fresh after verification, or escalation after two failed refresh/recheck attempts.
