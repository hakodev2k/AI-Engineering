# Skill: Approval-Aware Latency Attribution

## Purpose
Measure agent/tool latency without confusing human approval dwell with actual tool execution.

## Trigger
Use when a trace, benchmark, incident, or agent conclusion says a tool is slow and the call required approval or could have paused before execution.

## Inputs
JSONL lifecycle events or normalized trace records containing call ID and timestamps.

## Preconditions
- Timestamps use the same monotonic or UTC clock domain.
- Each logical tool call has a stable call ID.
- Whether approval was required is known.

## Required context
Tool identity, lifecycle events, benchmark population, and the active `config/latency-policy.json`.

## Allowed tools
Trace readers, log queries, deterministic scripts, benchmark tooling, and read-only source inspection.

## Constraints
- MUST NOT infer tool slowness from total wall time when approval is present.
- MUST preserve raw timestamps as evidence.
- MUST NOT change production performance behavior until attribution is valid.

## Procedure
1. Capture a baseline sample before optimization.
2. Normalize every call into requested, approval-required, approval-decision, execution-start, execution-end, and postprocess-end timestamps.
3. Run `scripts/latency_attribution.py` to validate ordering and compute phase durations.
4. Separate `approval_wait_ms` from `tool_execution_ms` and `postprocess_ms`.
5. Mark records with missing or impossible boundaries as `insufficient_evidence`.
6. Compare execution-time distributions, not approval-inclusive wall time, for tool performance.
7. Form one falsifiable hypothesis for the slowest execution phase.
8. Implement at most one material performance change per measurement cycle.
9. Re-run the same workload and compare before/after execution metrics.
10. Have the verifier confirm trace validity and regression calculation independently.

## Decision points
- If approval dominates total time but execution is healthy: classify as approval UX/orchestration latency, not tool performance.
- If execution is slow with valid boundaries: continue performance diagnosis.
- If boundaries are incomplete: stop and fix instrumentation first.

## Expected output
A phase-attribution report with evidence, validity, per-phase durations, baseline comparison, and a supported or rejected hypothesis.

## Metrics
`approval_wait_ms`, `tool_execution_ms`, `postprocess_ms`, `total_wall_ms`, p50/p95 execution latency, invalid-trace rate, regression percentage.

## Verification
Run the deterministic tests and independently recompute at least one sample from raw timestamps.

## Failure handling
Do not guess missing timing boundaries. Return `insufficient_evidence`, preserve the raw trace, and instrument the missing boundary.

## Stop conditions
Stop when evidence is invalid, two optimization attempts fail to improve the same metric, or the measured regression is below the configured threshold.
