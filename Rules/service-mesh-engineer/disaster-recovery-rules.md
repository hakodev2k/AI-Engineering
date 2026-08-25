# Disaster Recovery
## Purpose
Recover mesh governance and connectivity after control-plane, trust, or regional failures.
## Scope
Backups, CA recovery, configuration restoration, gateways, clusters, and regional failover.
## MUST
- Recovery objectives MUST cover control-plane state, trust material, and critical configuration.
- Backups MUST be restorable and tested, not merely created.
- Recovery procedures MUST define order dependencies between identity, discovery, policy, and traffic.
## MUST NOT
- MUST NOT store recovery credentials with the same failure domain as the system they recover.
- MUST NOT assume application recovery succeeds if mesh identity or routing state is absent.
- MUST NOT perform destructive recovery steps without authorized approval.
## SHOULD
- Disaster exercises SHOULD validate both connectivity restoration and security enforcement.
## Exceptions
Manual recovery gaps require documented owner, risk, and remediation date.
## Verification
Run restore exercises, validate recovered certificates/policies/routes, measure RTO/RPO, and test failback.