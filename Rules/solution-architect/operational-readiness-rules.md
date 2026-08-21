# Operational Readiness Rules

## Purpose
Ensure a system can be supported, recovered, diagnosed, and safely operated before production reliance.

## Scope
Covers ownership, monitoring, runbooks, incidents, capacity, backups, deployment, support, and dependency management.

## MUST
- Every production service MUST have a clear operational owner and escalation path.
- Critical failure scenarios MUST have detection and response guidance.
- Runbooks MUST exist for recurring or high-impact operational procedures.
- Capacity, quotas, certificates, secrets, storage growth, and dependency limits MUST be monitored when exhaustion can cause outage.
- Production readiness MUST include backup/recovery, observability, deployment, rollback, and access controls where relevant.

## MUST NOT
- MUST NOT hand over a production system without ownership and support expectations.
- MUST NOT claim readiness when operators cannot distinguish healthy from degraded behavior.
- MUST NOT depend on undocumented individual knowledge for critical recovery.

## SHOULD
- Run readiness reviews before major launches.
- Use game days or incident simulations for critical systems.

## Exceptions
Low-criticality internal systems may use lighter runbooks with explicitly lower support expectations.

## Verification
Review runbooks, on-call ownership, dashboards, alerts, recovery tests, access controls, capacity monitoring, and readiness checklists.