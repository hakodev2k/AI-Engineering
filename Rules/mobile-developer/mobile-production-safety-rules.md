# Mobile Production Safety Rules
## Purpose
Prevent high-impact mobile changes from reaching users without bounded risk and recovery controls.
## Scope
Production configuration, releases, remote flags, data changes, security controls, and backend compatibility.
## MUST
- Production-impacting changes MUST identify blast radius, monitoring, rollback/mitigation, and decision owner before execution.
- Destructive data behavior, weakened security controls, breaking public/client contracts, signing changes, and irreversible migrations MUST require explicit authorized human approval.
- Release health MUST be observed after rollout using relevant crash, performance, and critical-flow signals.
## MUST NOT
- Production safeguards MUST NOT be bypassed solely to meet a deadline.
- A mobile release MUST NOT assume immediate user adoption or instant binary rollback.
## SHOULD
- Prefer staged, reversible, remotely containable changes for uncertain or high-risk behavior.
## Exceptions
Emergency actions may use an approved incident runbook with bounded scope and mandatory audit trail.
## Verification
Inspect approvals, rollout configuration, monitoring dashboards, compatibility evidence, audit logs, and recovery tests.