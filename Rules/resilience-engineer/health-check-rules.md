# Health Check Rules

## Purpose
Ensure health signals drive safe routing and recovery decisions without causing avoidable outages.

## Scope
Applies to liveness, readiness, startup, dependency, synthetic, and load-balancer health checks.

## MUST
- Health checks MUST reflect the decision they control: liveness for restartability, readiness for traffic eligibility, and synthetic checks for user-critical behavior.
- Readiness MUST fail when an instance cannot safely serve the traffic it may receive.
- Liveness checks MUST avoid transient dependency failures that would create restart storms.
- Health thresholds MUST tolerate expected short-lived variance while detecting material impairment within recovery objectives.
- Health-check failures and state transitions MUST be observable.

## MUST NOT
- MUST NOT use one undifferentiated endpoint for every health decision when failure semantics differ.
- MUST NOT make liveness depend on a shared downstream service unless process restart is actually corrective.
- MUST NOT report healthy solely because the process is running when critical serving capability is unavailable.

## SHOULD
- Critical paths SHOULD have external synthetic validation in addition to local checks.
- Health endpoints SHOULD be inexpensive and protected from accidental information disclosure.

## Exceptions
Minimal systems may share health endpoints only when the semantics are demonstrably equivalent and documented.

## Verification
Inspect probe definitions and routing behavior, inject local and dependency failures, and confirm the system removes unhealthy capacity without inducing unnecessary restarts or cascading loss.