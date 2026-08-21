# Operational Readiness

## Purpose
Ensure a system can be deployed, monitored, supported, recovered, and safely changed before production ownership begins.

## When to use
Use before production launch, major migration, critical feature rollout, or operational handover.

## Inputs
Deployment plan, runbooks, SLOs, dashboards, alerts, ownership, recovery procedures, dependency list, security controls.

## Preconditions
Production topology and support model are defined.

## Context to inspect
Health checks, dashboards, alert routing, on-call, backups, rollback, feature flags, capacity, quotas, certificates, secrets, incident contacts.

## Core knowledge
A system is not production-ready merely because functional tests pass. Operators need observable symptoms, bounded failure behavior, recovery paths, and decision authority.

## Procedure
1. Confirm production ownership and escalation path.
2. Validate deployment and rollback procedure.
3. Confirm health/readiness endpoints and dependency semantics.
4. Validate dashboards and actionable alerts.
5. Confirm capacity and quota headroom.
6. Test backup/restore or recovery where applicable.
7. Validate secrets, certificates, and expiry monitoring.
8. Review runbooks for common incidents.
9. Exercise a representative failure or game day.
10. Confirm launch criteria and post-launch monitoring period.

## Decision points
Delay launch when recovery or observability gaps create unacceptable business risk. Do not block on cosmetic runbook gaps with no material impact.

## Common failure patterns
No rollback, alerts without owners, untested restore, hidden manual dependencies, no certificate expiry monitoring, launch-day-only monitoring.

## Verification
Operational checklist is backed by executed evidence, not declarations.

## Expected output
Production readiness evidence and outstanding accepted risks.

## Stop conditions
Stop when no accountable production owner or safe rollback/recovery path exists.