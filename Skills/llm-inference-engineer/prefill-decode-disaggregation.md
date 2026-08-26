# Prefill and Decode Disaggregation

## Purpose
Determine whether separating prefill and decode resources improves utilization and SLO isolation for heterogeneous LLM traffic.

## When to use
Use for large-scale serving where long prompts interfere with decode latency or resource profiles differ materially.

## Inputs
Prompt/output distributions, prefill/decode profiles, network topology, KV-transfer capability, SLOs, and fleet inventory.

## Context to inspect
Scheduler, KV transport, routing, queueing, network bandwidth, failure recovery, cache locality, and autoscaling boundaries.

## Core knowledge
Prefill is commonly compute-heavy while decode is memory-bandwidth sensitive. Disaggregation can specialize resources but introduces KV transfer, routing, synchronization, and operational complexity.

## Procedure
1. Profile prefill and decode independently under representative traffic.
2. Quantify interference in the current colocated design.
3. Estimate KV transfer volume and network latency.
4. Prototype separate pools with explicit queue and routing metrics.
5. Test transfer failure, backpressure, cancellation, and retry semantics.
6. Tune independent capacity and scaling thresholds.
7. Compare end-to-end TTFT, inter-token latency, throughput, and cost.
8. Validate behavior during pool imbalance and node loss.
9. Adopt only if measured gains exceed complexity and network cost.

## Decision points
Keep colocated serving when workloads are modest or network transfer erases gains. Disaggregate when interference is persistent and independent scaling creates material benefit.

## Common failure patterns
Ignoring KV transfer cost, scaling pools independently without flow control, retrying partial work unsafely, and optimizing component metrics instead of end-to-end latency.

## Verification
Load-test mixed workloads, failure scenarios, and scaling transitions; compare against a tuned colocated baseline.

## Expected output
Evidence-backed architecture decision and operating envelope.

## Stop conditions
Stop if KV transport is unreliable, insecure, or cannot meet latency requirements.