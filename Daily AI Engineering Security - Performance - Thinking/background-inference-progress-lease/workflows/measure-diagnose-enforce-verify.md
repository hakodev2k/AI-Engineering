# Workflow — Measure, Diagnose, Enforce, Verify

## Trigger
Background model usage is unexplained, repeated, detached from foreground progress, or a new background worker is being introduced.

## Goal
Reduce wasteful background inference while preserving useful worker completion and correctness.

## Inputs
Worker telemetry, owner lifecycle events, token/request counters, progress definitions, baseline traces, policy thresholds.

## Baseline
Capture at least: calls/job, input tokens/job, duplicate fingerprints, no-progress streaks, durable output changes, owner-terminal-to-worker-stop latency.

## Context
Define one observable progress signal per worker purpose before optimization. Examples: memory revision hash, review artifact version, committed patch digest, completed indexing shard.

## Stages
1. **Observe** — collect representative traces including normal and suspected runaway jobs.
2. **Measure baseline** — run `python scripts/progress_lease_analyzer.py <trace.jsonl>` with candidate limits; record violations without enforcement.
3. **Diagnose** — separate transport retries, model-requested continuation, scheduler duplication, stale owner state, and successful-no-progress re-entry.
4. **Form hypothesis** — state which invariant is missing and predict the metric change after enforcement.
5. **Implement** — add durable lease checks before dispatch and atomic counter persistence.
6. **Measure again** — compare calls/tokens and useful progress changes on the same workload class.
7. **Improved?** — if no, revise thresholds/progress signal at most twice. Do not remove terminal-owner or hard-budget guards.
8. **Independent verification** — `subagents/lease-verifier.md` reviews evidence and tests.

## Responsible agent
Runtime implementer for stages 1–7; independent Lease Verifier for stage 8.

## Tools
Telemetry store, lifecycle store, metrics backend, analyzer, test runner.

## Outputs
Baseline report, hypothesis, enforced policy, before/after metrics, verification record.

## Checkpoints
- Progress signal defined and observable.
- Counters durable across restart/retry.
- Baseline captured before enforcing.
- No-progress and terminal fixtures block.
- Useful work completion rate does not materially regress.

## Metrics
Calls/job, tokens/job, progress changes/call, duplicate rate, breaker trips, false-positive blocks, completion rate, stop latency.

## Retry policy
Maximum two threshold/progress-signal revisions after first measurement. Each retry requires new evidence; no blind retries.

## Stop conditions
Stop on verified improvement, two failed revisions, missing authoritative lifecycle state, or any correctness regression that cannot be explained and fixed safely.

## Failure path
Disable only the new non-terminal heuristic if it causes false positives; retain terminal-owner and hard-budget protections. Escalate with traces and counters. Never hide failure by expanding budgets indefinitely.

## Verification
Run regression fixtures and compare a representative before/after trace. Verification must distinguish implementation presence from measured effect.

## Definition of Done
Evidence documented; baseline captured; lease enforced; budgets survive retries; progressing work succeeds; runaway fixtures are blocked; before/after metrics recorded; independent verifier status is `verified`; residual risks documented.
