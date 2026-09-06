# Inference Load and Saturation Testing

## Purpose
Determine how an inference service behaves from normal load through saturation, including queue growth, tail latency, throughput ceilings, memory pressure, and overload recovery.

## When to use
Use before production launch, after material runtime/model changes, or when capacity and overload behavior are uncertain.

## Inputs
Production-shaped traffic model, request-length distributions, concurrency ranges, SLOs, hardware configuration, autoscaling policy, and failure thresholds.

## Context to inspect
Inspect queue limits, batch scheduler, admission control, accelerator memory, host resources, network, autoscaling, timeouts, cancellations, and downstream dependencies.

## Core knowledge
A serving system often appears healthy until a nonlinear saturation point is crossed. At saturation, queue delay and tail latency can grow faster than throughput. Tests must include variable token lengths and burst patterns because constant homogeneous load hides scheduler and memory failure modes.

## Procedure
1. Define realistic workload cohorts and arrival patterns.
2. Establish steady-state baseline at low utilization.
3. Increase offered load in controlled steps.
4. Record throughput, p50/p95/p99 latency, queue age, utilization, memory, errors, and rejects.
5. Repeat with mixed prompt/output lengths.
6. Run burst tests above nominal capacity.
7. Test cancellations, timeouts, and client disconnects.
8. Observe autoscaling and admission behavior.
9. Hold near saturation long enough to expose leaks and fragmentation.
10. Reduce load and verify the service recovers without manual intervention.
11. Define the safe operating envelope below the collapse point.

## Decision points
Use open-loop traffic to expose overload and closed-loop traffic to model real clients. Keep production limits below measured saturation with headroom for variance and failures.

## Common failure patterns
Testing only average request shapes, stopping before thermal or memory steady state, reporting maximum throughput without latency, and ignoring recovery after overload.

## Verification
Repeat tests and confirm stable saturation thresholds, bounded failure behavior, and documented safe capacity under representative workload mixes.

## Expected output
A capacity curve, saturation point, safe operating envelope, and overload/recovery evidence.

## Stop conditions
Stop immediately if the test threatens shared production systems, violates quotas, or causes destructive downstream effects.