# Circuit Breakers and Bulkheads

## Purpose
Prevent failing dependencies or workloads from exhausting shared resources and causing cascading failure.

## When to use
Use where remote dependencies can become slow/unavailable or where one tenant/workload can consume resources needed by others.

## Inputs
Dependency behavior, concurrency limits, connection pools, thread/task pools, traffic classes, and SLOs.

## Context to inspect
Inspect client libraries, resource pools, retry behavior, fallback paths, queue consumers, and deployment scaling.

## Core knowledge
Circuit breakers reduce repeated calls to known-unhealthy dependencies; bulkheads isolate resource pools so one failure domain cannot consume everything. Both require careful thresholds and observability.

## Procedure
1. Identify cascading-failure paths.
2. Find shared constrained resources.
3. Define failure signals and breaker thresholds.
4. Define open, half-open, and recovery behavior.
5. Partition critical workloads into appropriate concurrency/resource pools.
6. Define fallback or rejection behavior.
7. Coordinate with retries and timeouts.
8. Instrument breaker state, saturation, rejection, and recovery.
9. Exercise dependency degradation and overload tests.

## Decision points
Use isolation where workloads have different criticality or failure characteristics. Do not add breakers around cheap local operations or where a platform already provides equivalent control.

## Common failure patterns
Breakers without timeouts, fallback that calls the same failing dependency, one global pool for all workloads, and thresholds that flap during normal variance.

## Verification
Demonstrate that a degraded dependency cannot exhaust all caller resources and that healthy traffic remains serviceable.

## Expected output
Isolation and circuit-breaking policy with thresholds, telemetry, and tested recovery.

## Stop conditions
Escalate when resource ownership is unclear or rejection/fallback semantics require business approval.