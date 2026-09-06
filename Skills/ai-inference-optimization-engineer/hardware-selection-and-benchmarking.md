# Hardware Selection and Benchmarking

## Purpose
Select accelerators and host configurations based on measured inference economics rather than theoretical peak specifications.

## When to use
Use when choosing GPU/accelerator types, evaluating new hardware, or matching models to heterogeneous serving fleets.

## Inputs
Model sizes, precision options, workload cohorts, latency/throughput targets, memory requirements, hardware candidates, pricing, and availability constraints.

## Context to inspect
Inspect accelerator memory capacity/bandwidth, compute formats, interconnect, host CPU, PCIe, NUMA topology, power limits, runtime support, kernel maturity, and quota/availability.

## Core knowledge
Inference may be compute-bound, memory-bandwidth-bound, communication-bound, or host-bound depending on prefill/decode and workload shape. Peak FLOPS alone is insufficient. Cost per useful token under the required SLO is often the most actionable comparison.

## Procedure
1. Define representative workload cohorts and required SLOs.
2. Verify runtime and kernel support for each candidate.
3. Benchmark identical model artifacts and settings.
4. Measure prefill and decode separately.
5. Capture throughput, p95/p99 latency, memory, utilization, power where available, and cost.
6. Test realistic concurrency and sequence-length distributions.
7. Identify host or network bottlenecks that mask accelerator capability.
8. Compare cost per request and per generated token at acceptable SLOs.
9. Evaluate capacity fragmentation and fleet availability.
10. Document the recommended hardware by workload class.

## Decision points
Prefer hardware that delivers the best workload-specific economics, not the highest peak benchmark. Use heterogeneous fleets when distinct workloads benefit from different memory or compute profiles.

## Common failure patterns
Comparing vendor peak numbers, mismatched software stacks, ignoring host bottlenecks, benchmarking tiny prompts only, and excluding availability or quota risk from the decision.

## Verification
Results must be reproducible across multiple runs and use identical workload definitions. Confirm the chosen hardware meets both performance and capacity requirements.

## Expected output
A hardware decision matrix with benchmark evidence, economics, limitations, and workload placement guidance.

## Stop conditions
Stop when candidate stacks use materially different model quality, hardware access is unstable, or pricing/availability data is too uncertain for a durable decision.