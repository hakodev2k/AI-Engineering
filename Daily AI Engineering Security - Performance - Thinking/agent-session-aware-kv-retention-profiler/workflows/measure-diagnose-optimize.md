# Workflow: Measure, Diagnose, Optimize

## Trigger
Agent-serving latency or cache-reuse investigation.

## Goal
Reduce expensive re-prefill at lifecycle boundaries without trading away security isolation or causing cache-pressure regressions.

## Inputs
Representative baseline trace, serving configuration, acceptance thresholds.

## Baseline
Record model/topology, turn count, reused-prefix ratio, median/p95 TTFT, resume miss rate and avoidable prefill tokens. Record throughput/cache occupancy externally when available.

## Context
Agent runtimes know lifecycle state; inference engines know cache state. Optimization attempts to bridge only the information needed for retention.

## Stages
1. **Observe** — instrument session, turn and lifecycle event.
2. **Measure baseline** — generate baseline report.
3. **Diagnose** — locate high-cost resume misses and completed branches retained unnecessarily.
4. **Form hypothesis** — choose exactly one bounded policy change: short protect TTL, offload-on-wait, prefetch-before-resume, or release-on-complete.
5. **Optimize** — implement in the platform's supported cache API; do not alter tenant isolation.
6. **Measure again** — replay comparable workload.
7. **Improved?** — compare reports. If no, re-evaluate once with a different evidence-backed hypothesis.
8. **Verify** — independent Cache Benchmark Verifier reproduces comparison.
9. **Complete** — document accepted policy and rollback trigger.

## Responsible agent
Platform implementer for stage 5; `subagents/cache-benchmark-verifier.md` for stage 8.

## Tools
`scripts/profile_cache.py`, serving metrics, platform benchmark/replay harness.

## Outputs
Baseline/candidate reports, hypothesis record, verification result.

## Checkpoints
After baseline, after hypothesis, after candidate measurement, before rollout.

## Metrics
Median/p95 TTFT; reused-prefix ratio; resume miss rate; avoidable prefill tokens; throughput/cache occupancy if available.

## Retry policy
Maximum two candidate hypotheses. Each retry requires a changed hypothesis justified by the prior measurement.

## Stop conditions
Success threshold met; two failed hypotheses; incomparable workload; insufficient telemetry; cache pressure/security isolation regression.

## Failure path
Revert candidate, preserve reports, identify missing telemetry or capacity constraint, escalate if platform-level cache API is insufficient.

## Verification
Independent reproduction and regression gate.

## Definition of Done
Baseline exists; root cause supported by trace; candidate measured on comparable workload; target metrics improve; no blocking regression; independent verification complete.
