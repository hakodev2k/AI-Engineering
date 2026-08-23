# Traffic Shedding and Graceful Degradation

## Purpose
Protect critical system capacity during overload or dependency failure by reducing optional work and preserving essential user journeys.

## When to use
Use during saturation, cascading latency, dependency exhaustion, retry storms, or partial capacity loss.

## Inputs
Traffic volumes, capacity limits, endpoint criticality, dependency health, queue depth, latency/error metrics, and available throttling or feature controls.

## Context to inspect
Inspect rate limits, admission control, priority classes, retries, timeouts, expensive operations, background workloads, caches, and fallback behavior.

## Core knowledge
Overloaded systems often fail nonlinearly. Shedding work early can improve total successful throughput. Degradation must prioritize business-critical operations and avoid silent data corruption.

## Procedure
1. Identify the saturated resource or dependency.
2. Determine which workloads consume it.
3. Rank workloads by business criticality and recovery cost.
4. Disable or throttle optional and expensive paths first.
5. Bound retries and reduce timeout amplification.
6. Prefer cached, stale-safe, or simplified responses where correctness permits.
7. Apply admission control before queues become unbounded.
8. Monitor successful throughput, latency, errors, and saturation.
9. Restore workloads gradually after stable headroom returns.

## Decision points
Choose rejection over queuing when waiting cannot succeed within useful latency. Use stale data only where freshness requirements explicitly permit it.

## Common failure patterns
Uniform throttling, unbounded queues, retry amplification, degrading critical operations before optional ones, and restoring all traffic immediately after a brief recovery.

## Verification
Verify critical success rate improves, saturation decreases, and degradation behavior is visible and reversible.

## Expected output
A controlled degradation plan with workload priorities, thresholds, active controls, and restoration criteria.

## Stop conditions
Escalate when traffic controls can violate safety, financial correctness, regulatory obligations, or contractual priority guarantees.