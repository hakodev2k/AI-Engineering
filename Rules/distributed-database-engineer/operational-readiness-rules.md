# Operational Readiness Rules

## Purpose
Ensure a distributed database is supportable before it carries production-critical workloads.

## Scope
Launch readiness, ownership, runbooks, monitoring, maintenance, recovery, and on-call preparedness.

## MUST
- Production launch MUST have named ownership, service objectives, dashboards, alerts, runbooks, backup/recovery evidence, and escalation paths.
- Known capacity and failure limits MUST be documented.
- Routine maintenance and emergency procedures MUST be executable by authorized operators without undocumented tribal knowledge.
- Critical dependencies and their failure behavior MUST be identified.

## MUST NOT
- MUST NOT declare readiness when restore, failover, or rollback paths are untested for material workloads.
- MUST NOT launch with critical alerts lacking response procedures.
- MUST NOT make production deployment solely because functional tests pass.

## SHOULD
- Readiness SHOULD include a failure-mode review and game-day exercise for high-criticality systems.

## Exceptions
Accepted launch gaps require explicit owner, risk approval, compensating controls, and due date.

## Verification
Use readiness checklists, runbook walkthroughs, recovery drills, alert tests, capacity evidence, and ownership records.