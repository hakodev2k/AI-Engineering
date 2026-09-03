# Skill: Lifecycle Latency Investigation

## Purpose
Turn coarse agent wall time into evidence-backed lifecycle phase measurements.

## Trigger
A run is slow, a tool is accused of being slow, a host/version changes, or external monitoring needs reliable state.

## Inputs
Lifecycle JSONL, `config/policy.json`, workload identity, baseline trace when comparing versions.

## Preconditions
Timestamps use one clock domain per run or have been normalized. Correlation IDs are available.

## Required context
Agent host/version, model, workload, approval mode, tool names, environment constraints.

## Allowed tools
Read-only logs/traces, Python profiler, benchmark commands, issue/documentation research.

## Constraints
Do not infer hidden reasoning. Do not combine approval or queue time with tool execution. Do not optimize before baseline validity is established.

## Procedure
1. Capture an unmodified baseline trace.
2. Run `python scripts/lifecycle_profiler.py <trace> --policy config/policy.json`.
3. If the profiler fails, repair instrumentation before performance diagnosis.
4. Partition latency into model, approval, tool and residual host phases.
5. State Facts, Assumptions, Evidence and Hypotheses separately.
6. Choose the largest attributable phase with actionable evidence.
7. Implement one bounded change.
8. Repeat the same workload and profiler.
9. Compare only equivalent phase metrics.
10. Request independent verification before declaring regression fixed.

## Decision points
- Missing phase event: stop diagnosis and fix instrumentation.
- Large approval wait: classify as UX/HITL latency, not tool latency.
- Large tool execution: investigate the tool itself.
- Large unexplained residual: instrument additional host transitions.

## Expected output
Validated phase ledger, ranked bottleneck hypotheses, before/after measurements, risks and verification status.

## Metrics
Completeness ratio, invalid events, TTFT, model duration, approval wait, tool duration, turn duration, residual duration.

## Verification
Same workload, valid traces, independent reviewer, no regression beyond policy thresholds.

## Failure handling
Maximum two instrumentation-repair attempts. If correlation remains incomplete, report insufficient evidence and stop optimization.

## Stop conditions
Stop when attribution is valid and target metric meets the acceptance threshold, or after two failed hypotheses without new evidence.
