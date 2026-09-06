# Inference Fault Tolerance and Recovery

## Purpose
Design and validate inference-serving behavior when accelerators, workers, model providers, network links, or runtime processes fail.

## When to use
Use when building production inference fleets, introducing distributed serving, or investigating failure amplification and stuck requests.

## Inputs
Serving topology, failure domains, request semantics, retry policy, timeout budget, redundancy model, stateful cache behavior, and reliability SLOs.

## Context to inspect
Inspect worker health checks, load balancer behavior, request idempotency, streaming semantics, KV-cache ownership, distributed collectives, autoscaling, draining, and provider failover.

## Core knowledge
Inference failures can leave expensive work, cache state, or distributed collectives behind. Blind retries amplify overload and may duplicate side effects. Streaming requests require clear semantics because partial output may already have reached the client. Recovery must preserve bounded latency and capacity.

## Procedure
1. Enumerate worker, device, process, network, and dependency failure modes.
2. Define which failures are retryable and under what remaining latency budget.
3. Bound retry count and add jitter where multiple clients may retry simultaneously.
4. Propagate cancellation and deadlines through all serving layers.
5. Ensure failed sequences release KV cache and scheduler state.
6. Define health checks that detect inability to serve, not merely process liveness.
7. Design safe worker drain and replacement behavior.
8. Test partial-stream failures explicitly.
9. Inject failures during steady and saturated load.
10. Measure recovery time, error rate, queue behavior, and resource cleanup.

## Decision points
Retry only when requests are safe to replay and capacity exists. Prefer fast failover to another healthy replica for worker-local failures; avoid cross-region or provider fallback when added latency or quality changes violate the contract.

## Common failure patterns
Retry storms, zombie requests, leaked cache memory, liveness checks that pass broken workers, replaying streamed requests from the beginning without client semantics, and distributed jobs hanging after one rank fails.

## Verification
Failure-injection tests must demonstrate bounded retries, clean resource reclamation, healthy-worker routing, and recovery within stated reliability objectives.

## Expected output
A failure matrix, retry/failover policy, recovery procedures, and validated fault-injection evidence.

## Stop conditions
Stop when replay semantics are undefined, failure injection could affect uncontrolled production traffic, or recovery requires destructive intervention without approval.