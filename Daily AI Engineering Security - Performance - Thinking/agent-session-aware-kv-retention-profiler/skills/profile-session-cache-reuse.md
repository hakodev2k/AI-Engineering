# Skill: Profile Session Cache Reuse

## Purpose
Measure where agent lifecycle transitions coincide with expensive prefix-cache misses and quantify the opportunity for bounded session-aware retention.

## Trigger
High TTFT on resumed agents, low/unstable prefix-cache hit rate, large repeated prefixes, multi-agent fanout, or evaluation of a cache-retention change.

## Inputs
JSONL turn trace with `session_id`, `turn`, `input_tokens`, `reused_prefix_tokens`, `ttft_ms`, and optional `event` (`active`, `wait`, `resume`, `complete`).

## Preconditions
Trace values must come from comparable serving instrumentation. Tenant/security cache isolation remains unchanged.

## Required context
Model, serving topology, cache implementation, workload window and retention configuration.

## Allowed tools
Read-only serving traces, `scripts/profile_cache.py`, benchmark harness, metrics backend.

## Constraints
Do not infer model quality from cache metrics. Do not retain cache across security/tenant boundaries. Do not tune without a baseline.

## Procedure
1. Capture a baseline trace for a representative workload.
2. Run `python scripts/profile_cache.py baseline.jsonl --out baseline-report.json`.
3. Inspect aggregate reuse ratio, TTFT distribution and resume-miss metrics.
4. Rank resume misses by `avoidable_prefill_tokens = max(input_tokens - reused_prefix_tokens, 0)`.
5. Form a hypothesis: protect/offload a session during a bounded wait, release completed branches, or leave policy unchanged.
6. Apply one candidate policy in the serving/orchestration layer.
7. Replay a comparable workload and profile `candidate.jsonl`.
8. Run the comparison mode and evaluate TTFT, reuse and avoidable-prefill deltas.
9. Accept only when configured metrics improve without material regression or cache-capacity harm.

## Decision points
A high global hit rate with costly resume misses still qualifies for targeted optimization. Low reuse caused by genuinely changing prompts does not. A candidate that improves reuse but worsens p95 TTFT beyond threshold fails.

## Expected output
JSON report with turn count, reuse ratio, median/p95 TTFT, resume count, resume misses and avoidable prefill tokens; optional baseline/candidate deltas.

## Metrics
Reused-prefix ratio; median/p95 TTFT; resume miss rate; avoidable prefill tokens; throughput and cache occupancy when supplied by platform metrics.

## Verification
Use the same workload class for before/after, run unit tests, and have the Benchmark Verifier independently evaluate the report.

## Failure handling
If traces are incomplete, stop. If candidate regresses, revert and test at most one revised hypothesis. Maximum two optimization attempts per investigation.

## Stop conditions
Stop when improvement criteria pass, two hypotheses fail, telemetry is insufficient, or security/tenant isolation would need to be weakened.
