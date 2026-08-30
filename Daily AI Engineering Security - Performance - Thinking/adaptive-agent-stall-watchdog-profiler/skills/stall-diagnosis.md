# Skill: Stall Watchdog Diagnosis

## Purpose
Determine whether watchdog aborts represent true stalls, slow healthy work, stream faults, timeout-precedence bugs, or retry amplification.

## Trigger
Exact-threshold abort clusters, repeated resumes, high token burn, slow local models, or unexplained long-agent failures.

## Inputs
Phase-level run traces, timeout configuration, model/effort/context metadata, heartbeat/progress events, retry/token/cache counters.

## Preconditions
A stable trace schema and representative workload; destructive tools must be stubbed for replay.

## Required context
All active timers from provider, transport, agent, workflow, and global diagnostics layers.

## Allowed tools
Trace analysis, benchmarks, repository read/search, `scripts/watchdog_profiler.py`, non-destructive replay.

## Constraints
Always measure a baseline. Never claim improvement from a larger timeout alone. Never disable all watchdogs. Never permit unbounded retries.

## Procedure
1. Group aborts by phase, model, effort, context size, and exact timeout boundary.
2. Compute p50/p95/p99 durations for successful runs in the same cohort.
3. Mark candidate false aborts when a timeout falls inside the healthy latency distribution or a bounded resume succeeds shortly after abort.
4. Build the effective timeout chain and find shadowed settings.
5. Quantify retries, duplicate work, tokens, cache loss, and queue occupancy.
6. Form a phase-specific hypothesis.
7. Change one policy dimension at a time: heartbeat semantics, timeout budget, reconnect behavior, or retry cap.
8. Replay the same corpus and compare completion, false-abort rate, latency, and cost.
9. Require independent verification before rollout.

## Decision points
- Healthy p99 approaches/exceeds watchdog: tune phase budget or liveness signal.
- No progress signal and no successful recovery: preserve fail-fast behavior.
- Retry cost exceeds configured multiplier: stop retries and escalate.
- Provider timeout exceeds a shorter global timer: fix precedence before tuning values.

## Expected output
Baseline distribution, root-cause classification, recommended policy, before/after evidence.

## Metrics
False-abort rate, true-stall detection time, completion rate, retry amplification, tokens/task, p95/p99 phase latency.

## Verification
Improvement requires lower false-abort/retry cost with no material increase in undetected true stalls and no regression in completion quality.

## Failure handling
Revert to last known-good bounded watchdog policy and preserve trace evidence. Maximum tuning cycles: 2.

## Stop conditions
Stop when evidence is insufficient to distinguish slow from stuck, retry budget is exceeded, or policy changes would remove all bounded failure detection.
