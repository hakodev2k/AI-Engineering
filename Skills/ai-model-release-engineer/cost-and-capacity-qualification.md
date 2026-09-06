# Cost and Capacity Qualification

## Purpose
Validate that an AI release can sustain forecast demand within compute, quota, and unit-economics constraints.

## When to use
Use before production promotion, traffic expansion, larger context windows, provider changes, or materially more expensive models.

## Inputs
Demand forecast, token distributions, concurrency, hardware or API pricing, quotas, autoscaling limits, SLOs, and fallback policy.

## Preconditions
Workload assumptions and cost-accounting boundaries are explicit.

## Context to inspect
Inspect historical demand, peak factors, cache hit rates, batch efficiency, reserved capacity, provider limits, regional constraints, and failover capacity.

## Core knowledge
Average cost per request is insufficient for capacity planning. Peak concurrency, long-tail token usage, retry amplification, redundancy, and failover headroom materially affect required capacity.

## Procedure
1. Segment workloads by model, request shape, and priority.
2. Estimate steady-state and peak compute/token demand.
3. Include retries, safety overhead, shadow traffic, and failover reserve.
4. Calculate unit cost and monthly range under realistic scenarios.
5. Validate quotas and provisioning lead times.
6. Load-test representative capacity limits.
7. Define degradation, routing, or admission-control policies.
8. Establish budget and capacity alerts.
9. Document assumptions and sensitivity to demand or pricing changes.

## Decision points
Reserve capacity for predictable sustained demand; use elastic capacity for variable demand when startup latency and quotas allow. Prefer cheaper models only when quality gates remain satisfied.

## Common failure patterns
Planning from averages, ignoring retry storms, no failover reserve, stale pricing, hidden egress costs, and assuming autoscaling can overcome hard provider quotas.

## Verification
Recalculate from observed workload samples, confirm quotas directly, and test alerts plus degradation behavior near limits.

## Expected output
A cost/capacity envelope with assumptions, headroom, alerts, and release constraints.

## Stop conditions
Stop when peak demand cannot be served safely, budget ownership is missing, quota assumptions are unverified, or fallback behavior violates requirements.
