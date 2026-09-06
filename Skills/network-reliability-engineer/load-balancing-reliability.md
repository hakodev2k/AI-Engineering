# Load Balancing Reliability

## Purpose
Design and troubleshoot load-balancing behavior for availability, predictable failover, capacity, and safe traffic distribution.

## When to use
Use when introducing L4/L7 load balancers, tuning health checks, investigating uneven traffic, or reviewing failover architecture.

## Inputs
Listener configuration, backend pools, health checks, session policy, TLS settings, traffic metrics, and failure history.

## Context to inspect
Inspect client affinity, connection reuse, backend registration, draining, health-check scope, retry behavior, timeout chains, and dependency health.

## Core knowledge
A load balancer can mask or amplify application failure. Health checks must represent service readiness, while retries, connection persistence, and draining must align with backend behavior.

## Procedure
1. Define traffic and availability requirements.
2. Inspect balancing algorithm and stickiness.
3. Validate health-check endpoints and thresholds.
4. Review timeout and retry interactions.
5. Check connection draining and deployment behavior.
6. Validate capacity and overload response.
7. Test backend loss and restoration.
8. Review TLS termination and client-IP preservation.
9. Document expected failover behavior.

## Decision points
Use L7 when application-aware routing is required; prefer L4 for lower overhead and protocol transparency. Use affinity only when application state requires it.

## Common failure patterns
Health checks too shallow, retry storms, overloaded surviving backends, sticky sessions hiding imbalance, premature connection termination, and synchronized failover.

## Verification
Observe backend distribution, simulate controlled backend failure, confirm draining, and validate latency/error behavior under reduced capacity.

## Expected output
A verified load-balancing configuration or remediation plan.

## Stop conditions
Escalate when testing may disrupt production or backend health semantics are not owned or understood.