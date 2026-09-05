# Skill: Parallel Batch Baseline Analysis

## Purpose
Find the highest tool-call concurrency that improves latency without violating result completeness or tool-safety constraints.

## Trigger
Concurrency feature enablement; runtime/provider upgrade; new MCP/custom tools; missing-result incident; latency tuning.

## Inputs
Representative trace JSONL; integrity and latency SLO; tool conflict classifications; retry history.

## Preconditions
Representative non-destructive workload exists. Mutating tools need idempotency or isolated test environments.

## Required context
Expected tool-call IDs, delivered result IDs, concurrency, latency, and execution status for each batch.

## Allowed tools
Trace export, benchmark harness, package analyzer, runtime logs.

## Constraints
Do not claim improvement without before/after data. Unknown state-mutating tools run sequentially. Security approvals remain blocking.

## Procedure
1. Capture baseline at concurrency 1.
2. Test increasing concurrency levels on the same workload distribution.
3. For each batch, compare expected and received result IDs.
4. Calculate completeness rate, missing-result count, and p95 latency per concurrency.
5. Identify the first concurrency level violating completeness or latency SLO.
6. Form a hypothesis about executor, transport, state, or result-bookkeeping limits.
7. Apply a hard cap below the failing boundary or implement a targeted fix.
8. Replay the benchmark and compare against baseline.
9. Run conflict/idempotency tests for mutating tools.
10. Hand results to Benchmark Verifier.

## Decision points
Completeness below SLO is always blocking even if latency improves. A concurrency increase is accepted only if it meets both integrity and latency criteria.

## Expected output
Per-level metrics, maximum verified concurrency, before/after comparison, residual risks.

## Metrics
Completeness rate; p95 latency; throughput; missing results; wasted completed calls; retries; task success.

## Verification
Independent replay on representative traces/workload.

## Failure handling
Reduce concurrency once and retest. A second integrity failure stops tuning and escalates.

## Stop conditions
No concurrency level meets the SLO; tool side effects are not safely replayable; measurements are incomplete.