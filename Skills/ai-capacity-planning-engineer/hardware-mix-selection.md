# Hardware Mix Selection

## Purpose
Choose an accelerator and host mix that satisfies model fit, throughput, latency, reliability, supply, and cost requirements without creating unnecessary fleet complexity.

## When to use
Use for procurement, cloud instance selection, fleet refresh, new model onboarding, or migration between accelerator generations.

## Inputs
Representative benchmarks, model memory requirements, precision, latency and throughput targets, power limits, availability, pricing, support horizon, software compatibility.

## Preconditions
Benchmark workloads represent production behavior and software-stack support is validated.

## Context to inspect
CUDA/runtime versions, inference/training frameworks, interconnect, host CPU/RAM, driver support, rack power, scheduler labels, cloud quotas, vendor lead times.

## Core knowledge
The cheapest or fastest accelerator in isolation may not produce the best system capacity. Hardware choice affects memory fit, batching, topology, operational complexity, spare pools, and software compatibility.

## Procedure
1. Define workload requirements and hard constraints.
2. Benchmark candidate hardware on representative models.
3. Normalize results to usable throughput at SLO-compliant latency.
4. Compare memory headroom and parallelism needs.
5. Include host, network, power, and operational costs.
6. Assess supply and quota risk.
7. Quantify fleet-fragmentation cost.
8. Select primary and fallback hardware classes.
9. Document migration and deprecation assumptions.

## Decision points
Prefer fewer hardware classes when performance differences are modest. Accept specialization when a workload gains material cost, memory, or latency advantage.

## Common failure patterns
Comparing theoretical FLOPS, ignoring software maturity, choosing hardware that cannot fit future model versions, and creating too many tiny pools.

## Verification
Run production-like load tests and confirm scheduler placement, failover, and operational tooling support the selected classes.

## Expected output
A hardware decision matrix with preferred pools, fallback options, and capacity contribution per class.

## Stop conditions
Escalate when supply, compatibility, or benchmark evidence is too uncertain for an irreversible commitment.