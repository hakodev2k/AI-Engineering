# Network Resilience Experiments

## Purpose
Validate system behavior under realistic network degradation such as latency, packet loss, connection interruption, DNS issues, and partial reachability.

## When to use
Use for distributed systems, service-to-service communication, external APIs, multi-zone deployments, or any architecture that assumes reliable network connectivity.

## Inputs
Service topology, network paths, timeout and retry policies, load-balancer behavior, DNS configuration, connection pools, SLIs, and dependency contracts.

## Preconditions
Targets and traffic paths can be isolated, rollback is available, and guardrails protect unrelated services.

## Context to inspect
Client timeout hierarchy, retry budgets, circuit breakers, connection reuse, health checks, service discovery, DNS TTLs, regional routing, and protocol semantics.

## Core knowledge
Network failures are often partial and asymmetric. Excess latency can be more damaging than complete disconnection because requests occupy threads, sockets, and queues while retries amplify load. Senior experiments test application behavior, not merely whether connectivity drops.

## Procedure
1. Identify the communication path and protected user outcome.
2. Establish a baseline for latency, errors, and saturation.
3. Choose one realistic network impairment.
4. Confirm timeout and retry expectations before execution.
5. Apply the impairment to the smallest useful target set.
6. Observe request amplification, queueing, connection use, and downstream effects.
7. Verify circuit breaking, fallback, and load shedding where designed.
8. Measure user impact and recovery time.
9. Remove the impairment and confirm connection pools and routing recover.
10. Record architecture or configuration gaps.

## Decision points
Prefer latency experiments when timeout behavior is uncertain, connection interruption when failover is the focus, and DNS scenarios when service discovery is a material dependency. Avoid combining several impairments until individual behavior is understood.

## Common failure patterns
Retry storms; timeout hierarchies where upstream waits less than downstream; stale DNS; connection pools that do not recover; health checks that pass while requests fail; and asymmetric partitions hidden by aggregate metrics.

## Verification
Confirm measured effects match the intended network condition, steady-state behavior is evaluated, and recovery completes without manual cleanup unless manual recovery is explicitly under test.

## Expected output
Experiment evidence, observed failure propagation, recovery measurements, and specific resilience improvements.

## Stop conditions
Stop if traffic cannot be scoped, control channels share the impaired path without safeguards, or user-impact thresholds are exceeded.