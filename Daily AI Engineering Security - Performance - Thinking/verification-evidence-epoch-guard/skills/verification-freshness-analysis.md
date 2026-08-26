# Skill: Verification Freshness Analysis

## Purpose
Decide whether a previous passing verification result is still valid for the exact workspace state being completed.

## Trigger
After code/config mutation, after a verification run, before a completion claim, or when a runtime says verification is stale.

## Inputs
Current snapshot identifier, verified snapshot identifier, verification epoch, previous epoch, exit code, verification timestamp, worktree dirty state, captured diff state.

## Preconditions
The verifier can obtain a stable snapshot identifier (commit/tree hash or deterministic content digest) and an authoritative verification exit code.

## Required context
Task acceptance criteria, verification command identity, current workspace state, prior verification record. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Read-only Git state inspection, deterministic hashing, test runners, `scripts/verification_epoch_guard.py`.

## Constraints
A prose claim MUST NOT substitute for executable evidence. Historical changed paths MUST NOT be treated as current dirty state. Reverification MUST be bounded.

## Procedure
1. Record Facts: current snapshot, worktree state, prior epoch and latest passing result.
2. Record Assumptions separately; do not promote them to evidence.
3. Generate a new monotonic epoch only when a verification command actually executes.
4. Bind result, exit code and time to the verified snapshot.
5. Run the guard against current state.
6. If stale, identify exactly one invalidating reason and reverify only after addressing it.
7. Re-evaluate after at most two retries.
8. Hand fresh evidence to an independent verifier before final completion for high-impact changes.

## Decision points
Fresh only when snapshot identity matches, exit code is zero, epoch is monotonic, TTL is valid, and any dirty diff is captured.

## Expected output
Facts, Evidence, Invalidators, Decision (`fresh|reverify|block`), Verification status.

## Metrics
Redundant verification runs/task, stale-state false positives, stale-green escapes, verification retries, unsupported completion claims.

## Verification
Recompute the current snapshot independently and ensure the stored evidence references it exactly.

## Failure handling
Preserve evidence; do not weaken freshness criteria. On two failed freshness retries, stop and escalate the inconsistent state.

## Stop conditions
Fresh decision with independent snapshot match, or maximum two retries reached.
