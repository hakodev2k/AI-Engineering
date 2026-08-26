# Traffic Management

## Purpose
Control traffic distribution safely during normal operation, releases, and degradation.

## Scope
Weighted routing, canaries, blue-green cutovers, locality, failover, and traffic shifting.

## MUST
- Traffic shifts MUST define target population, measurable success criteria, abort conditions, and rollback.
- Regional or locality routing MUST account for data residency and dependency constraints where applicable.
- Failover capacity MUST be validated before relying on it for resilience.
- Automated traffic movement MUST have bounded authority and observable decisions.

## MUST NOT
- MUST NOT shift all production traffic to an unproven target in one irreversible step when staged validation is feasible.
- MUST NOT assume standby capacity can absorb failover without evidence.
- MUST NOT violate residency or security constraints for availability convenience.

## SHOULD
- Progressive delivery SHOULD use representative low-risk traffic first.
- Traffic policy SHOULD be deterministic and version-controlled.

## Exceptions
Emergency failover requires incident justification, accountable approval where feasible, and immediate post-shift validation.

## Verification
Review configuration diff, capacity evidence, canary metrics, synthetic probes, locality tests, and rollback execution.