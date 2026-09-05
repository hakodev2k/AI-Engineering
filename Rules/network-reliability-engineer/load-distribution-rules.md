# Load Distribution Rules

## Purpose
Ensure traffic distribution mechanisms preserve availability and do not concentrate failure unexpectedly.

## Scope
Load balancers, gateways, health-based routing, pools, service endpoints, and traffic distribution policies.

## MUST
- Health checks MUST reflect whether a target can safely serve the intended traffic.
- Distribution policies MUST define behavior when targets become unhealthy or capacity is reduced.
- Changes to pool membership or weighting MUST be observable and reversible.
- Critical services MUST validate that health checks do not create synchronized or cascading failure.
- Distribution state MUST be monitored alongside backend health.

## MUST NOT
- MUST NOT keep known-unhealthy targets active merely to preserve nominal capacity.
- MUST NOT rely on a health check that validates only process existence when service readiness is required.
- MUST NOT change traffic weighting without checking downstream capacity.

## SHOULD
- Prefer gradual traffic shifts for high-impact changes.
- Test degraded-capacity behavior before relying on it in production.

## Exceptions
Exceptions require scope, risk, monitoring, rollback, and approval.

## Verification
Review health-check configuration, traffic metrics, backend state, failover tests, and change evidence.