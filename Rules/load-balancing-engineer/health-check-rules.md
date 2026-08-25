# Health Check Rules

## Purpose
Prevent unhealthy or merely unreachable backends from receiving traffic while avoiding false eviction of healthy capacity.

## Scope
Active/passive health checks, readiness signals, synthetic probes, dependency checks, and backend ejection.

## MUST
- Health checks MUST test a signal that correlates with the backend's ability to serve the routed workload.
- Probe interval, timeout, healthy/unhealthy thresholds, and recovery thresholds MUST be explicit.
- Readiness and liveness semantics MUST remain distinct when the platform supports both.
- Dependency-aware checks MUST avoid creating correlated mass eviction when a shared dependency fails.
- Health-check changes MUST be tested for false-positive and false-negative behavior.

## MUST NOT
- MUST NOT treat process existence alone as proof of service readiness.
- MUST NOT make a health endpoint perform expensive work that can amplify an incident.
- MUST NOT expose sensitive diagnostic data through unauthenticated health endpoints.

## SHOULD
- Use hysteresis to reduce flapping.
- Prefer lightweight local readiness signals plus independent dependency monitoring where shared dependencies could cause fleet-wide eviction.

## Exceptions
Any nonstandard probe must document why normal readiness semantics are insufficient, expected failure modes, and rollback criteria.

## Verification
Review probe configuration, simulate backend and dependency failures, inspect ejection/recovery timing, and verify traffic stops and resumes within the documented bounds.