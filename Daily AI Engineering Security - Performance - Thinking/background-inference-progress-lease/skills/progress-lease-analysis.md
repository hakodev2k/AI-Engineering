# Skill — Progress Lease Analysis

## Purpose
Determine whether a background model-calling worker may issue another request based on durable progress, owner lifecycle, and cumulative budgets.

## Trigger
Before every background model request and after every background model response.

## Inputs
Worker ID, owner ID/state, worker purpose, request fingerprint, progress version/fingerprint, cumulative request count, cumulative input tokens, configured limits.

## Preconditions
Telemetry must be durable enough that worker restart/reconnect cannot silently reset counters. Owner state must be read from the authoritative lifecycle store.

## Required context
Only lifecycle state, counters, fingerprints, and the minimum output metadata needed to establish progress. Do not load full prompts solely to evaluate the lease.

## Allowed tools
Telemetry/event store reads, deterministic hashing, `scripts/progress_lease_analyzer.py`, metrics backend, lifecycle store.

## Constraints
- Never infer progress from assistant prose such as “continuing”.
- Never treat HTTP 200/model success as progress by itself.
- Do not reset counters on retry, reconnect, worker respawn, or context compaction.
- Do not expose hidden chain-of-thought; fingerprints should derive from observable request/state fields.

## Procedure
1. Resolve authoritative owner state. Terminal owner states deny the lease.
2. Load the worker’s durable cumulative request/token counters.
3. Compute or read the current request fingerprint from normalized observable request metadata.
4. Read the durable progress version. Examples: committed memory revision, changed-file digest, completed review artifact hash, tool/result state transition.
5. Compare with the previous granted request. Increment consecutive no-progress and duplicate-fingerprint counters when unchanged.
6. Evaluate request, token, time, duplicate, and no-progress limits.
7. Return `allow` only if all hard limits pass and the worker has an explicit continuation reason.
8. Persist the decision and counters atomically before dispatch.
9. After response, record whether the expected durable output actually changed.

## Decision points
- Owner completed/cancelled: deny immediately.
- Hard budget exceeded: deny and escalate if work remains required.
- Consecutive no-progress threshold reached: trip circuit breaker.
- Progress changed within budget: renew lease.
- Telemetry missing/inconsistent: fail closed for unattended workers; request human/operator review for high-value work.

## Expected output
A structured lease decision with worker, owner, purpose, counters, progress version, decision, reason, and timestamp.

## Metrics
Requests/worker, input tokens/worker, no-progress streak, duplicate fingerprint streak, progress changes/request, prevented calls/tokens.

## Verification
Replay known progressing and runaway fixtures through the analyzer; progressing sequences must pass while terminal/no-progress/budget violations return exit 2.

## Failure handling
If durable counters cannot be read, do not create a fresh zero-budget lease. Mark state `unknown` and block unattended dispatch.

## Stop conditions
Stop once the worker reaches terminal output, owner becomes terminal, any hard budget is exceeded, or the no-progress threshold trips.
