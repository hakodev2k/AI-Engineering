# Prefill and Decode Disaggregation

## Purpose
Separate prefill and decode execution when their resource profiles differ enough that independent scheduling improves utilization, latency, or capacity.

## When to use
Use for large autoregressive models where long prompt processing and token-by-token decoding compete inefficiently on the same worker pool.

## Inputs
Prompt/output length distributions, accelerator topology, network fabric, runtime capabilities, KV-cache transfer options, latency SLOs, and concurrency targets.

## Context to inspect
Inspect prefill compute intensity, decode memory-bandwidth behavior, cache-transfer volume, scheduler queues, topology bandwidth, failure domains, and admission policy.

## Core knowledge
Prefill is typically compute-heavy while decode is often memory-bandwidth and cache-capacity sensitive. Disaggregation can improve specialization but introduces cache-transfer latency, coordination, and operational complexity.

## Procedure
1. Profile prefill and decode utilization separately.
2. Quantify contention when both share workers.
3. Estimate KV state transfer size and network cost.
4. Determine whether separate worker pools can improve resource matching.
5. Define routing from prefill completion to decode workers.
6. Design cache ownership, transfer, timeout, and cleanup semantics.
7. Size each pool from workload ratios rather than static symmetry.
8. Test network saturation and worker failures.
9. Compare end-to-end p95/p99 latency and throughput with colocated serving.
10. Define fallback behavior when either pool is saturated.

## Decision points
Keep stages colocated when transfer overhead or operational complexity outweighs resource gains. Disaggregate when stage utilization profiles are strongly different and the interconnect can move cache state cheaply enough.

## Common failure patterns
Ignoring cache-transfer latency, asymmetric capacity planning, decode starvation, orphaned cache state, cross-zone transfers, and benchmarking without realistic prompt/output ratios.

## Verification
Confirm stage-specific utilization improves, end-to-end SLOs remain satisfied, failure recovery works, and no cache state leaks across requests.

## Expected output
A measured architecture and capacity policy for separate prefill and decode pools.

## Stop conditions
Stop when cache transfer exceeds the latency budget, topology cannot guarantee required bandwidth, or the runtime lacks safe state-transfer semantics.