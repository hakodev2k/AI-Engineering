# Workflow: Measure → Diagnose → Guard → Replay

## Trigger
Enablement/regression of parallel tools, multi-call approval, same-session concurrent requests, or observed missing/duplicate/looping calls.

## Goal
Preserve concurrency benefits while proving per-batch state consistency.

## Inputs
Representative task fixtures, sequential and parallel runner modes, normalized trace output, tool side-effect metadata.

## Baseline
Run the same fixtures sequentially and with current parallel execution. Record p50/p95 latency, throughput, retries, lost/duplicate/non-terminal calls, and state conflicts.

## Context
Use structured traces; no hidden reasoning is required.

## Stages
1. **Observe** — reproduce at least one failing fixture and capture the raw event sequence.
2. **Measure baseline** — collect sequential and current-parallel metrics.
3. **Diagnose** — run `scripts/batch_trace_analyzer.py`; map violations to shared state/transport/handoff/approval boundaries.
4. **Form hypothesis** — state one falsifiable cause and expected trace change.
5. **Implement improvement** — add batch identity, durable continuation state, version gate, selective serialization/barrier, or idempotency key as required.
6. **Measure again** — rerun the same workload with unchanged acceptance criteria.
7. **Improved?** — if invariant failures remain, perform at most one additional diagnosis/remediation cycle.
8. **Verify** — Batch Consistency Verifier reviews traces and metrics independently.

## Responsible agent
Implementation owner for stages 1–7; `subagents/batch-consistency-verifier.md` for stage 8.

## Tools
Trace instrumentation, `scripts/batch_trace_analyzer.py`, unit/integration tests, benchmark runner.

## Outputs
Before/after metrics, analyzer JSON, implementation diff, verifier result.

## Checkpoints
- No implementation before baseline exists.
- No retry logic without idempotency classification.
- No completion while a call lacks a terminal event.
- No performance claim without same-fixture comparison.

## Metrics
p50/p95 batch latency, throughput, lost-call rate, duplicate rate, retry count, state conflicts, approval continuation success.

## Retry policy
Maximum two remediation cycles total. Each cycle must test a different evidence-backed hypothesis or a materially changed implementation.

## Stop conditions
Stop on inability to correlate calls, unbounded retry, unproven destructive idempotency, or no correctness improvement after two cycles.

## Failure path
Disable only the unsafe concurrency class when possible (for example conflicting state writes), retain independent parallel calls, preserve traces, and escalate the blocking invariant.

## Verification
Analyzer passes, tests pass, no correctness regression, and verifier returns PASS.

## Definition of Done
All calls reach one terminal state; no unexplained duplicates/loss; session version conflicts are explicit; approvals/handoffs resume the correct batch; performance is measured against sequential baseline; residual risk is documented.