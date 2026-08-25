# Skill — Latency Attribution

## Purpose
Turn lifecycle telemetry into evidence suitable for performance decisions without exposing or requesting hidden chain-of-thought.

## Trigger
A run appears slow, an agent proposes a performance root cause, or a change is justified by elapsed time.

## Inputs
Timing JSON with `request_start`, optional approval bounds, `tool_start`, `tool_end`, optional `result_ingested`, and optional `next_model_start`; policy; workload metadata.

## Preconditions
Timestamps use one clock domain or synchronized clocks; the record indicates whether approval occurred.

## Required context
Tool name, cycle/run ID, runtime build, workload ID, approval policy, and baseline environment.

## Allowed tools
Trace/log readers, deterministic profiler scripts, benchmark tools, public issue trackers.

## Constraints
Do not infer missing timestamps. Do not turn correlation into causation. Do not weaken security controls.

## Procedure
1. Preserve the raw timing record.
2. Run `scripts/latency_phase_gate.py`.
3. If invalid, repair instrumentation before diagnosis.
4. If ambiguous, collect the missing lifecycle boundary and repeat once.
5. Compare execution, approval, and post-tool overhead with a matched baseline.
6. Form at most three hypotheses about the dominant measured phase.
7. Run one discriminating experiment per hypothesis.
8. Permit optimization only when evidence identifies the owning layer.
9. Re-measure and hand off to the independent reviewer.

## Decision points
- `invalid`: stop; telemetry cannot support a conclusion.
- `ambiguous`: no causal claim; collect missing evidence.
- `attributable`: a claim may name only the phase actually measured.

## Expected output
Normalized phase durations, attribution status, blocking reasons, evidence IDs.

## Metrics
Unsupported-claim rate, ambiguous-record rate, p95 by phase, hypothesis rejection rate, rework rate.

## Verification
The verifier recomputes durations from raw timestamps and checks before/after comparability.

## Failure handling
One instrumentation retry; up to three diagnosis experiments; two implementation attempts; then escalate.

## Stop conditions
Stop when provenance remains ambiguous, the workload cannot be reproduced, or a proposed experiment would weaken safety/correctness.
