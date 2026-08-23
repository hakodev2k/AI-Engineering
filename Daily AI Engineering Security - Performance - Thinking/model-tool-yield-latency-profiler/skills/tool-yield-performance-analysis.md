# Skill: Tool-Yield Performance Analysis

## Purpose
Measure where agent wall-clock time is spent across model and tool phases and identify avoidable serial model↔tool yields.

## Trigger
High agent latency, tool-heavy workloads, suspected orchestration overhead, or regression in trace timing.

## Inputs
JSONL trace; workload identity; optional baseline thresholds; optional dependency-group annotations.

## Preconditions
Timestamps use one consistent clock domain and tool call IDs are stable within the trace.

## Allowed tools
Trace readers, deterministic scripts, benchmark harnesses, application logs.

## Constraints
- MUST establish a baseline before optimization.
- MUST NOT infer that two mutating calls are independent without evidence.
- MUST preserve approval, ordering, cancellation, idempotency and shared-state semantics.
- MUST use the same representative workload for before/after comparison.

## Procedure
1. Validate trace ordering and tool-call pairing.
2. Compute end-to-end duration, tool active intervals and model/tool transition windows.
3. Derive tool-yield count: one yield covers a contiguous batch of overlapping tool calls awaited before model continuation.
4. Compute p50/p95 yield duration and non-tool gap time.
5. Identify serial calls that share an explicit dependency group marked independent or otherwise have documented non-dependence.
6. Rank candidates by estimated wall-clock savings.
7. Choose strategy: bounded parallel batch, programmatic tool execution, or retain sequential execution.
8. Re-run the same workload and compare metrics plus correctness.

## Decision points
- Independent, read-only, same-phase calls → candidate for bounded batching.
- Deterministic multi-step chain with no fresh model judgment → candidate for programmatic tool execution.
- Shared mutation/result dependency/approval ordering → keep sequential.

## Expected output
Structured report with baseline metrics, candidate groups, evidence, proposed transformation and verification status.

## Metrics
Yields/task, p50/p95 yield ms, total duration, tool-active ratio, potential savings, realized savings, correctness failures.

## Verification
No improvement claim unless measured after the change on equivalent work.

## Failure handling
Reject malformed traces. Allow at most two optimization revisions when metrics fail to improve; then retain baseline behavior and escalate.

## Stop conditions
Stop when a verified improvement meets target without regressions, or when two bounded attempts fail to beat baseline safely.