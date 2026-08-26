# Workflow: Benchmark and Compare

## Trigger
Enablement or recalibration of P2P KV pulls, or any model/GPU/fabric/router/connector change.

## Goal
Measure → Diagnose → Hypothesize → Optimize → Measure again, then promote only a non-regressing pull policy.

## Inputs
Representative workload, deployment signature, baseline routing policy, candidate pull policy, policy thresholds.

## Baseline
Capture TTFT p50/p95, request latency, achieved throughput, failed-pull rate, cache hits, prefix lengths and destination load distribution.

## Context
Use the same model, hardware, topology and workload definition for baseline and candidate arms.

## Stages
1. **Observe** current routing and cache locality.
2. **Measure baseline** with pull disabled/current threshold.
3. **Diagnose** where remote cache exists but recompute or queueing dominates.
4. **Form hypothesis** about pull/recompute crossover by load/topology segment.
5. **Collect samples** for both modes at representative prefix lengths.
6. **Profile** with `scripts/kv_cost_profiler.py`.
7. **Implement improvement** in a staging router policy only for measured segments.
8. **Measure again** under identical offered load.
9. **Improved?** If no, re-evaluate once; if yes, send to independent verification.

## Responsible agent
Performance investigator gathers evidence; Benchmark Verifier independently checks promotion evidence.

## Tools
Profiler script, serving benchmark harness, router metrics, load generator.

## Outputs
Profiler JSON, baseline/candidate metric set, proposed crossover per segment, verification decision.

## Checkpoints
After baseline; after sample sufficiency check; before staging policy; before production promotion.

## Metrics
TTFT p50/p95, throughput, request latency, pull failure rate, crossover tokens, queue/load, transfer count.

## Retry policy
Maximum 2 calibration attempts per unchanged deployment signature.

## Stop conditions
Insufficient evidence, failed-pull rate above policy, p95 TTFT regression above policy, throughput regression, or exhausted retries.

## Failure path
Restore baseline policy and collect missing evidence; do not force P2P.

## Verification
Benchmark Verifier must reproduce comparison and pass the policy thresholds.

## Definition of Done
Baseline captured, cost model measured, candidate benchmarked, no configured regression, independent verification passes, risks documented, no blocking issue remains.
