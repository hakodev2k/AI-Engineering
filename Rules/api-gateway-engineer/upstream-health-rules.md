# Upstream Health

## Purpose
Ensure gateway health decisions reflect real dependency readiness without creating routing instability.

## Scope
Active and passive health checks, readiness, endpoint ejection, and recovery.

## MUST
- Health checks MUST test a signal that correlates with the upstream's ability to serve intended traffic.
- Thresholds and recovery behavior MUST avoid excessive flapping.
- Endpoint ejection MUST be observable and attributable.
- Health-check traffic MUST respect upstream capacity and security boundaries.

## MUST NOT
- MUST NOT treat process liveness alone as proof of service readiness when dependencies are required.
- MUST NOT route to endpoints known to be unhealthy unless an approved degraded-mode strategy requires it.
- MUST NOT expose sensitive diagnostics through public health endpoints.

## SHOULD
- Health policy SHOULD distinguish local endpoint failure from regional or systemic failure.
- Recovery SHOULD be gradual when sudden traffic restoration could overload an upstream.

## Exceptions
Exceptions require documented availability trade-offs, evidence, and rollback criteria.

## Verification
Simulate unhealthy endpoints, inspect ejection/recovery metrics, test readiness semantics, and validate routing during partial failures.