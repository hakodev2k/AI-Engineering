# Skill: Agent Bottleneck Audit

## Purpose
Identify the measured critical path and avoid optimizing the wrong agent component.

## Trigger
Latency/cost regression, new tool integration, scaling event, provider migration, or pre-release performance review.

## Inputs
Representative trace spans, task IDs, success/quality labels, stable external call keys, deployment metadata.

## Preconditions
Tracing covers LLM, tool/API, retrieval, sandbox, queue, and orchestration work for the target workload.

## Required context
A fixed replay workload and explicit quality floor.

## Allowed tools
Tracing exports, profiler script, benchmark runner, application logs, resource metrics.

## Constraints
MUST establish a baseline before changes. MUST NOT trade away security, required context, validation, or correctness for speed.

## Procedure
1. Capture at least one representative baseline run.
2. Normalize spans into canonical kinds: `llm`, `tool`, `retrieval`, `sandbox`, `queue`, `orchestration`, `other`.
3. Compute task p50/p95, component latency share, duplicate call rate, retry amplification, and failed-call latency.
4. Rank bottlenecks by critical-path contribution and p95 impact, not call count alone.
5. Record a single hypothesis with expected metric movement.
6. Choose a targeted optimization: deduplicate stable calls, cache safe results, parallelize independent work, reduce retries, pool sandboxes, or optimize model path only when model time is dominant.
7. Replay the identical workload.
8. Compare before/after metrics and quality rate.
9. If the target metric does not improve, revert/re-evaluate; maximum two attempts.
10. Hand off to an independent benchmark verifier.

## Decision points
If trace coverage is incomplete, improve instrumentation first. If duplicates are authorization- or freshness-sensitive, do not cache without a safe cache key and TTL. If p95 is integration-driven, prioritize timeout/fallback/retry policy over model throughput.

## Expected output
Baseline report, bottleneck ranking, hypothesis, candidate report, before/after delta, quality status.

## Metrics
Task p50/p95; component share; duplicate rate; retry amplification; external calls/task; quality pass rate.

## Verification
Independent replay with the same workload and configuration except the intended change.

## Failure handling
Transient benchmark failure: max 2 retries. Failed optimization hypothesis: max 2 implementation attempts, then revert and escalate.

## Stop conditions
Success requires measured improvement and preserved quality floor. Stop if instrumentation cannot attribute at least 90% of task wall-clock time or after two failed optimization attempts.
