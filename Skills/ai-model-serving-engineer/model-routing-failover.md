# Model Routing and Failover

## Purpose
Route inference traffic across model versions, hardware pools, regions, or providers while preserving capability, quality, and availability.

## When to use
Use for multi-model gateways, regional deployments, provider redundancy, staged migrations, or heterogeneous workload classes.

## Inputs
Model capabilities, SLOs, traffic classes, regional capacity, quality constraints, provider limits, fallback compatibility, and health signals.

## Preconditions
Fallback models are explicitly evaluated for the workloads they may receive.

## Context to inspect
Gateway policies, weighted routing, health checks, model aliases, circuit breakers, region affinity, tenant constraints, and rollback controls.

## Core knowledge
Successful failover requires semantic compatibility, not just API compatibility. Different models can vary in context window, tool calling, safety behavior, output schema, latency, and cost.

## Procedure
1. Classify requests by capability and risk requirements.
2. Define eligible models for each class.
3. Verify fallback behavior with regression tests.
4. Configure health and saturation signals.
5. Define circuit-breaker and failover thresholds.
6. Preserve tenant, region, and data-governance constraints.
7. Test partial and total backend failure.
8. Monitor quality, latency, and cost by route.
9. Restore preferred routes gradually after recovery.

## Decision points
Fail over only to models proven compatible with the request class. Prefer graceful degradation over silently lowering critical capability or safety.

## Common failure patterns
Routing by availability alone, alias drift, fallback models with smaller context limits, and oscillating traffic between unhealthy backends.

## Verification
Failure drills show requests move to eligible backends without contract, safety, or data-boundary violations.

## Expected output
A routing matrix, failover policy, tested thresholds, and recovery procedure.

## Stop conditions
Do not enable fallback paths whose capability, security, or compliance behavior is unverified.