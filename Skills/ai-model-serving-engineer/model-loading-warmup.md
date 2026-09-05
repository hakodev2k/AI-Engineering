# Model Loading and Warmup

## Purpose
Make model startup, loading, and warmup predictable so deployments and failovers do not create long outages or unstable first-request latency.

## When to use
Use when models take significant time to load, cold starts violate SLOs, or rollout/failover events cause latency spikes.

## Inputs
Model artifact size, storage path, runtime, hardware, initialization steps, compilation/graph capture behavior, readiness requirements.

## Preconditions
Model artifacts are versioned and integrity-checkable.

## Context to inspect
Artifact download/cache, filesystem and object-store bandwidth, deserialization, weight transfer, kernel compilation, CUDA graph capture, tokenizer initialization, and readiness probes.

## Core knowledge
A process being alive does not mean inference is ready. Warmup may trigger lazy allocation, compilation, graph capture, cache creation, and communication initialization.

## Procedure
1. Break startup into measurable phases.
2. Cache artifacts near compute where appropriate.
3. Verify checksums and exact model version.
4. Separate liveness from inference readiness.
5. Execute representative warmup requests.
6. Pre-initialize distributed communication paths.
7. Bound startup with timeouts and failure reporting.
8. Test concurrent replacement and failover scenarios.
9. Monitor startup duration by phase.

## Decision points
Use pre-warmed capacity when cold-start duration exceeds acceptable recovery time. Avoid keeping expensive idle replicas when fast loading can satisfy SLOs.

## Common failure patterns
Marking ready before warmup, downloading large weights on every restart, hidden lazy compilation, and no startup timeout.

## Verification
Restart under controlled load and confirm readiness is signaled only after stable representative inference succeeds.

## Expected output
A deterministic loading and warmup runbook with phase metrics and readiness criteria.

## Stop conditions
Escalate when artifact integrity, storage bandwidth, or startup duration makes safe rollout impossible.