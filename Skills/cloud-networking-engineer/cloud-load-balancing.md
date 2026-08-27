# Cloud Load Balancing

## Purpose
Select, configure, and operate cloud load balancing for resilient, secure, observable traffic distribution.

## When to use
Use when exposing services, scaling horizontally, adding regions, changing protocols, or diagnosing uneven traffic, health-check, latency, or failover problems.

## Inputs
Protocol, client behavior, TLS requirements, backend topology, health semantics, session needs, latency/SLOs, security controls, and expected traffic.

## Preconditions
Know application health semantics and failure behavior before defining health checks.

## Context to inspect
Listener rules, target groups/backend pools, health checks, connection timeouts, TLS policy, proxy headers, cross-zone behavior, autoscaling, WAF, logs, and metrics.

## Core knowledge
Layer-4 and Layer-7 load balancers differ in protocol awareness, performance, and policy capability. Health checks must represent serving readiness, not merely process existence. Connection reuse, draining, stickiness, and source-IP preservation affect application behavior.

## Procedure
1. Characterize protocol and traffic shape.
2. Choose L4 or L7 based on required semantics.
3. Define backend health and readiness signals.
4. Configure timeouts consistent with application behavior.
5. Design TLS termination or pass-through deliberately.
6. Decide source-IP and proxy-header handling.
7. Configure connection draining and deployment behavior.
8. Validate capacity and quotas.
9. Instrument request, connection, target, and error metrics.
10. Test backend loss, zone loss, overload, and certificate rotation.

## Decision points
Use L7 for HTTP-aware routing/policy; use L4 for protocol transparency or very high connection throughput. Avoid stickiness unless application/session constraints justify it.

## Common failure patterns
Shallow health checks, timeout mismatch, sticky hot spots, unsafe TLS policies, missing draining, proxy-header trust mistakes, and assuming a load balancer automatically provides multi-region resilience.

## Verification
Run representative load, remove targets, observe draining/failover, validate TLS and headers, inspect distribution, and confirm latency/error SLOs.

## Expected output
A load-balancing configuration, health model, capacity assumptions, observability, and failure-test evidence.

## Stop conditions
Stop if health semantics are unknown, certificate/private-key handling is unsafe, or traffic changes require production approval not yet obtained.