# Skill: Runtime Lifecycle Baseline and Reconciliation

## Purpose
Measure and control agent-owned subprocess/runtime growth without terminating unrelated processes or hiding legitimate parallelism.

## Trigger
Run before enabling the guard, after every runtime spawn, on owner terminal events, after reconnect/restore, and whenever process/RSS budgets are exceeded.

## Inputs
- owner id such as task/thread/turn id
- stable runtime key such as `server-name + normalized command + config fingerprint`
- PID, parent PID, process start time
- lifecycle event (`spawned`, `ready`, `idle`, `owner_terminal`, `disconnected`)
- configured process/RSS limits
- optional process snapshot JSON

## Preconditions
The host can observe the processes it launches. Each managed spawn must be registered before the child is considered ready.

## Required context
Only process metadata and normalized command fingerprints are required. Do not collect environment-variable values or command arguments that contain secrets.

## Allowed tools
Read-only process inspection, `scripts/runtime_reaper.py`, OS-native process APIs, application lifecycle events, benchmark/test runner.

## Constraints
- MUST target only resources whose PID and start-time identity were registered by the harness.
- MUST NOT kill by executable name alone.
- MUST NOT infer ownership solely from parent PID after a restart.
- MUST prefer reuse or graceful termination before forced kill.
- MUST preserve legitimate parallel runtimes when their owners are active and budgets allow them.

## Procedure
1. Capture a baseline over at least five representative tool-enabled turns: live owned count, duplicate runtime keys, RSS, CPU when available, spawn count, reuse count, and terminal-owner orphans.
2. Normalize each runtime into a reuse key. Exclude volatile values but include configuration that changes behavior or permissions.
3. Register spawn metadata atomically: owner, runtime key, PID, start time, creation timestamp, expected lifecycle.
4. On a request for an equivalent reusable runtime, verify the registered PID/start-time is alive and healthy; reuse it instead of spawning a duplicate.
5. On owner terminal state, mark its resources cleanup-eligible. Do not immediately kill resources intentionally shared by another active owner.
6. Reconcile the registry against observed processes. Classify entries as healthy, duplicate, stale, orphaned, PID-reused, or missing.
7. Gracefully stop stale/orphaned owned resources. Wait the configured grace period.
8. Verify exit. Escalate only the still-alive, identity-matching owned processes to forced termination.
9. Re-measure the same baseline scenario.
10. Independently verify that terminal owners retain zero non-shared children and that repeated-turn resource growth is bounded.

## Decision points
- PID exists but start time differs: classify as PID reuse; never terminate it from the stale registry entry.
- Runtime key is duplicated but owners are distinct and non-shareable: duplication may be legitimate; record it rather than collapse it.
- Resource budget exceeded with no safely identifiable stale resources: block new spawns and escalate instead of killing uncertain processes.
- Graceful shutdown repeatedly fails: mark runtime unhealthy and require operator review after bounded attempts.

## Expected output
A lifecycle report containing baseline, current snapshot, ownership classifications, cleanup actions, before/after metrics, and PASS/BLOCK status.

## Metrics
Owned process count, duplicate count, terminal-owner orphan count, RSS slope per turn, spawn/reuse ratio, graceful cleanup rate, forced kill count, p95 tool latency.

## Verification
Repeat the same N-turn benchmark at least twice. PASS requires no monotonic unbounded growth, zero owned orphans after terminal-owner grace periods, and no termination of unregistered processes.

## Failure handling
Retry observation once for transient process-enumeration errors. Retry graceful cleanup once. Do not retry forced termination more than once per process identity. Preserve sanitized evidence and stop when ownership cannot be proven.

## Stop conditions
Stop and BLOCK on uncertain process ownership, PID/start-time mismatch, repeated registry corruption, more than two cleanup cycles without convergence, or any evidence that an unrelated process was targeted.