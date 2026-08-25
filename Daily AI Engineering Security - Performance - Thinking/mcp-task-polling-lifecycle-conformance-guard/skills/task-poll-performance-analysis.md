# Skill: MCP Task Poll Performance Analysis

## Purpose
Measure and diagnose MCP Tasks polling lifecycle inefficiency without sacrificing cancellation or terminal-state correctness.

## Trigger
High requests/task, long cancellation latency, suspected leaked polling loops, SDK upgrade, or Tasks conformance work.

## Inputs
Representative lifecycle traces, accepted terminal-detection SLO, SDK/version, configured poll and task deadlines.

## Preconditions
Trace timestamps MUST be monotonic per task and capture poll/cancel/terminal events at the orchestration boundary.

## Required context
MCP task statuses, server `pollIntervalMs` behavior, cancellation ownership, and host deadlines.

## Allowed tools
Read-only traces, benchmark harnesses, unit/integration tests, profiler/metrics queries, `task_poll_audit.py`.

## Constraints
MUST establish a baseline. MUST NOT reduce polling by hiding cancellation/terminal changes. MUST NOT claim improvement without before/after evidence.

## Procedure
1. Select representative completed, failed, cancelled, and slow-running tasks.
2. Capture baseline polls/task, elapsed polling lifetime, cancellation-to-stop, and terminal detection latency.
3. Run the deterministic auditor and classify violations.
4. Form one hypothesis at a time: cancellation propagation, cadence scheduling, terminal stop, or budget enforcement.
5. Implement the smallest lifecycle fix.
6. Replay the same trace/workload class.
7. Compare before/after requests/task and latency metrics.
8. Reject optimization if correctness regresses or accepted detection SLO is exceeded.
9. Independent verifier re-runs negative fixtures.

## Decision points
Post-cancel/terminal poll => blocking defect. Server interval violation => scheduling defect. Budget exhaustion => circuit break, not infinite retry. Lower polls but worse SLO => optimization rejected.

## Expected output
Baseline, hypothesis, candidate metrics, lifecycle violations, decision, risks, verification status.

## Metrics
Polls/task, p95 intervals, cancellation-to-stop, completion-detection latency, leaked-loop count.

## Verification
Use identical workload classes and require independent negative-case reproduction.

## Failure handling
Restore previous bounded behavior; preserve traces; stop after 2 failed optimization cycles.

## Stop conditions
Verified improvement, no measurable benefit, two failed cycles, or correctness regression.