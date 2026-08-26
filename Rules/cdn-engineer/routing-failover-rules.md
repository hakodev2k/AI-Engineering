# Routing and Failover Rules

## Purpose
Route traffic predictably and fail safely when origins, regions, or providers degrade.

## Scope
Applies to origin groups, health criteria, geo/latency routing, failover, recovery, and traffic steering.

## MUST
- Routing decisions MUST have explicit precedence and deterministic fallback behavior.
- Health checks MUST represent user-impacting service health rather than process existence alone.
- Failover capacity MUST be validated against expected diverted load.
- Recovery behavior MUST prevent rapid oscillation between unhealthy targets.
- Material routing changes MUST have rollback and blast-radius controls.

## MUST NOT
- MUST NOT fail traffic to a destination lacking required data, credentials, compliance posture, or capacity.
- MUST NOT treat synthetic health alone as proof of end-to-end correctness.
- MUST NOT perform global traffic shifts without explicit production approval.

## SHOULD
- Stage traffic shifts and observe service indicators between increments.
- Separate regional impairment from origin-wide failure where architecture supports it.
- Regularly exercise failover paths.

## Exceptions
Emergency routing may shorten normal review only under incident authority; action, evidence, risk, and subsequent verification MUST be recorded.

## Verification
Run controlled failover tests; inspect health-check behavior and routing logs; verify capacity, latency, errors, data correctness, and recovery stability.