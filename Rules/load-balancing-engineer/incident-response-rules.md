# Incident Response Rules

## Purpose
Restore safe traffic service quickly while preserving evidence and limiting secondary damage.

## Scope
Traffic incidents, regional failures, certificate failures, overload, routing errors, and backend instability.

## MUST
- Incident actions MUST prioritize user impact, blast-radius containment, and reversibility.
- Responders MUST use current telemetry to distinguish edge, load-balancer, network, and backend failure domains.
- High-risk traffic shifts, security-control changes, or destructive actions MUST require incident authority.
- Material actions and observed outcomes MUST be timestamped for later reconstruction.
- Recovery MUST verify user-visible success, backend health, capacity, and absence of hidden saturation.

## MUST NOT
- MUST NOT make multiple unrelated high-risk changes simultaneously when evidence can be gathered incrementally.
- MUST NOT erase logs or diagnostic state needed for investigation.
- MUST NOT leave temporary bypasses or weakened controls undocumented after stabilization.

## SHOULD
- Use predefined runbooks for common routing, TLS, overload, and failover incidents.
- Prefer reversible mitigations before invasive repair.

## Exceptions
Immediate life/safety or severe outage response may compress normal change procedure under authorized incident command.

## Verification
Review timeline, telemetry, configuration diffs, approvals, mitigation outcomes, recovery checks, and post-incident corrective actions.