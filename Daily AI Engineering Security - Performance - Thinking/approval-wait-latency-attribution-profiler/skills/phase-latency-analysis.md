# Skill: Phase-Separated Agent Latency Analysis

## Purpose
Measure approval wait, tool execution, model continuation, and end-to-end wall-clock separately so performance conclusions use the correct phase.

## Trigger
Use when a tool appears slow, a progress message cites a long elapsed interval, an approval-gated call influences architecture/tool choice, or latency instrumentation changes.

## Inputs
Correlated timestamps for call creation, approval request/resolution when applicable, execution start/end, and continuation completion.

## Preconditions
All timestamps must use the same monotonic or synchronized clock domain for a given call. Every lifecycle event must share one stable call ID.

## Required context
Know whether the action was approval-gated and which metric the decision needs: user-perceived wall-clock versus execution-only latency.

## Allowed tools
Sanitized traces, runtime logs, `scripts/latency_attribution.py`, unit tests, benchmark harnesses, and existing observability systems.

## Constraints
- MUST NOT infer execution latency from total wall-clock duration for approval-gated operations.
- MUST preserve approval overhead in UX/task-total metrics; separation is not deletion.
- MUST reject phase ordering that is impossible or incomplete.
- MUST establish a baseline before changing implementation for performance.

## Procedure
1. Capture at least five representative traces when feasible, including one delayed-approval trace for approval-gated paths.
2. Run the profiler for each trace and record phase-separated durations.
3. Validate lifecycle ordering. Invalid traces are observability defects, not performance evidence.
4. Compute baseline p50/p95 for `tool_execution_ms`; separately report approval wait and wall-clock.
5. State the hypothesis in one sentence, naming the execution phase expected to improve.
6. Optimize only if execution-only evidence supports the bottleneck.
7. Repeat the same workload/approval policy.
8. Compare before/after execution p50/p95 and total wall-clock without conflating them.
9. Independently verify any architectural change that was justified by latency.

## Decision points
- Large wall-clock, small execution: improve approval UX/policy or do nothing; do not optimize the tool.
- Large execution, small approval: legitimate tool/backend optimization candidate.
- Large continuation: investigate model/orchestration latency separately.
- Missing phase timestamps: instrument first; no technical latency conclusion is allowed.

## Expected output
Per-phase timing table, baseline, hypothesis, before/after metrics, evidence-quality verdict, and any remaining unattributed interval.

## Metrics
Approval wait, execution, continuation, wall-clock, unattributed time, p50/p95 execution latency, misattribution count.

## Verification
A performance claim is verified only when execution-only metrics improve on a comparable workload and phase ordering is valid.

## Failure handling
At most two instrumentation/measurement retries, each adding new evidence. If clock correlation remains invalid, stop optimization work and escalate observability repair.

## Stop conditions
No correlated phase data, invalid clock ordering after two retries, insufficient sample comparability, or optimization would weaken approval/security controls.
