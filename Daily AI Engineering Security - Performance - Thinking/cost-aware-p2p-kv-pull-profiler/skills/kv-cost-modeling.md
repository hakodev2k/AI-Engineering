# Skill: KV Pull Cost Modeling

## Purpose
Build a measured pull-versus-recompute policy for distributed KV-cache reuse.

## Trigger
New model/GPU/fabric, router or connector version change, TTFT regression, or enabling P2P KV sharing.

## Inputs
CSV samples containing mode, prefix tokens, destination load, topology, model, hardware, latency and success.

## Preconditions
Pull and recompute samples use the same workload definition and deployment segment.

## Required context
Model/hardware/topology identity, load level, prefix distribution, current router policy.

## Allowed tools
Read-only metrics, benchmark harness, `scripts/kv_cost_profiler.py`, unit tests.

## Constraints
Performance claims MUST use measured data. Samples from different model/hardware/topology segments MUST NOT be merged when policy requires same-segment calibration.

## Procedure
1. Capture baseline TTFT p50/p95, throughput, failed pulls and queue load without changing policy.
2. Collect paired pull/recompute samples across representative prefix lengths and load buckets.
3. Run the profiler and reject segments marked `insufficient_evidence`.
4. Inspect fitted pull/recompute slopes and crossover.
5. Form an explicit hypothesis for the new pull gate.
6. Replay benchmark traffic with the proposed gate.
7. Measure again and compare against policy regression thresholds.
8. Promote only after an independent verifier confirms the before/after evidence.

## Decision points
Do not recommend a crossover when sample count is insufficient, pull failures exceed policy, or the fitted relationship is non-informative.

## Expected output
Per-segment cost model, estimated crossover, sample counts, failure rate, benchmark comparison, verification status.

## Metrics
TTFT p50/p95, request latency, achieved throughput, pull success rate, queue depth/load, crossover tokens, cache-hit/pull count.

## Verification
Independent benchmark agent reproduces the policy comparison using the same workload definition.

## Failure handling
Revert to the measured baseline policy; never force P2P when evidence is weak.

## Stop conditions
Maximum two calibration revisions per deployment signature; stop on failed-pull rate above policy or any TTFT/throughput regression beyond threshold.
