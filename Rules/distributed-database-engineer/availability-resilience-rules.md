# Availability and Resilience Rules

## Purpose
Design database behavior that degrades safely under component, network, and dependency failures.

## Scope
Quorums, timeouts, retries, load shedding, redundancy, maintenance, and failure domains.

## MUST
- Availability targets MUST be translated into topology and operational requirements.
- Retry policies MUST use bounded attempts, backoff, and jitter where appropriate.
- Failure-domain assumptions MUST be explicit and reflected in replica placement.
- Maintenance procedures MUST preserve required redundancy or explicitly accept reduced protection.

## MUST NOT
- MUST NOT use unbounded retries or queues that amplify overload.
- MUST NOT count correlated replicas as independent resilience.
- MUST NOT sacrifice correctness silently to remain nominally available.

## SHOULD
- Systems SHOULD fail fast or shed noncritical work before saturation causes cascading failure.

## Exceptions
Temporary degraded redundancy requires monitoring, owner, time bound, and restoration plan.

## Verification
Use fault injection, dependency-failure tests, retry metrics, quorum checks, and maintenance simulations.