# Cold Start and Startup Performance

## Purpose
Reduce startup and first-request latency for serverless, autoscaled, containerized, desktop, or service workloads where initialization affects availability or user experience.

## When to use
Use when cold instances miss SLOs, deployments recover slowly, autoscaling lags because startup is expensive, or first-use latency is materially worse than steady state.

## Inputs
Startup traces, initialization code, dependency setup, image/package size, runtime configuration, deployment metrics, and cold/warm latency distributions.

## Context to inspect
Inspect dependency injection/container setup, module loading, JIT/AOT, migrations, network calls, secret/config retrieval, cache initialization, image pulls, and readiness probes.

## Core knowledge
Cold start contains multiple phases: scheduling/provisioning, artifact/image loading, process/runtime initialization, application initialization, and first-request warmup. Optimizing the wrong phase yields little benefit.

## Procedure
1. Define the cold-start boundary and target.
2. Measure phase-level startup timing.
3. Separate platform provisioning from application initialization.
4. Identify blocking I/O and eager initialization.
5. Remove unnecessary startup work or defer safely.
6. Reduce artifact/image/package size where material.
7. Evaluate precompilation/AOT or warm pools when supported.
8. Ensure readiness reports only when required dependencies are usable.
9. Test truly cold and warm scenarios separately.
10. Validate deployment, scaling, and failure behavior after changes.

## Decision points
Defer initialization only when first-use behavior remains safe. Pre-warm capacity when latency requirements justify ongoing cost.

## Common failure patterns
Benchmarking warm restarts as cold starts, moving required work after readiness, performing database migrations per instance, synchronous remote calls during startup, and optimizing application code when image pull dominates.

## Verification
Cold-start phase timings and first-request percentiles improve under equivalent deployment conditions without correctness or readiness regressions.

## Expected output
A startup decomposition and verified cold-start optimization plan.

## Stop conditions
Escalate when the dominant delay is controlled by a platform/provider outside available configuration.