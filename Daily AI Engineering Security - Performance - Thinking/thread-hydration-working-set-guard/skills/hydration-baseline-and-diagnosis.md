# Skill: Hydration Baseline and Diagnosis

## Purpose
Measure and diagnose thread open/resume cost before proposing changes.

## Trigger
Any change to session persistence, resume, history pagination, startup auto-resume, renderer history loading, or remote steering.

## Inputs
Telemetry JSONL containing `resume_start` / `resume_end`, thread IDs, `resume_ms`, `rss_mb`, and `loaded_items`; `config/policy.json`; representative thread fixtures.

## Preconditions
Telemetry timestamps and thread IDs MUST be attributable to one hydration operation. Baseline and candidate runs MUST use comparable thread fixtures and host conditions.

## Required context
Thread-size distribution, client/app-server versions, queue/concurrency settings, and whether model context was already compacted.

## Allowed tools
Local profilers, process RSS/CPU counters, structured logs, `scripts/hydration_profiler.py`, and non-destructive thread fixtures.

## Constraints
Do not delete history to manufacture an improvement. Do not disable correctness-required reconstruction. Treat model-context size and persisted-history size as separate variables.

## Procedure
1. Select small, medium, and oversized thread fixtures.
2. Capture baseline `resume_ms`, RSS, loaded items, CPU time, queue wait, and concurrent hydration count.
3. Run the deterministic profiler against the baseline.
4. Attribute the dominant cost to parsing, serialization, persistence I/O, eager history reconstruction, rendering, or queue contention.
5. Form one explicit hypothesis, such as lazy resume, bounded suffix loading, pagination, or reduced hydration concurrency.
6. Implement one material change at a time.
7. Repeat the identical fixture set and compare metrics.
8. Verify unrelated turns remain responsive during oversized hydration.

## Decision points
- If loaded items scale with full history, prioritize bounded working-set/windowing.
- If latency grows while loaded items stay bounded, inspect serialization, indexing, or I/O.
- If unrelated requests wait behind hydration, bound concurrency and isolate queues.
- If paginated resume fails across versions, stop rollout and require capability negotiation/fallback.

## Expected output
A before/after report with evidence for the bottleneck, hypothesis, measured result, residual risks, and pass/fail against policy.

## Metrics
p95 resume latency, peak RSS, loaded items, hydration CPU time, unrelated queue wait, and concurrency peak.

## Verification
Improvement is verified only when the same fixture set meets policy and no correctness-required history is missing.

## Failure handling
Capture the failing fixture and telemetry; revert the candidate optimization if correctness regresses. Maximum optimization retries: 3.

## Stop conditions
Stop after policy passes and independent verification succeeds, or after 3 failed hypotheses and escalate with collected evidence.
