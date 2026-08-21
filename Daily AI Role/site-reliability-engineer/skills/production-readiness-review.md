# Skill: Production Readiness Review

## Purpose
Determine whether a service/change is operationally ready for production load and failure conditions.

## Inputs
Architecture, deployment plan, SLOs, capacity assumptions, data model, dependencies, rollback plan, dashboards, alerts, runbooks, security constraints.

## Procedure
1. Trace critical user journeys and dependencies.
2. Confirm SLI/SLO ownership and alert actionability.
3. Review capacity, quotas, rate limits, connection pools, queues, storage growth, and scaling limits.
4. Review dependency timeout, retry, circuit-breaking, fallback, and idempotency behavior.
5. Check deployment safety: compatibility, migrations, staged rollout, rollback/roll-forward path.
6. Check operational evidence: dashboards, structured logs, traces, correlation IDs, health indicators.
7. Validate backup/restore or recovery path where persistent data matters.
8. Identify single points of failure and high-blast-radius changes.
9. Classify findings: blocker, required-before-scale, accepted-risk, improvement.
10. Require human approval for accepted critical risks.

## Outputs
Readiness verdict, findings, owners, deadlines, approval items, verification plan.

## Quality Gate
Every blocker maps to evidence and an explicit failure mode; no generic checklist-only verdict.

## Stop Conditions
Pass, pass-with-approved-risk, or block. Never leave verdict implicit.