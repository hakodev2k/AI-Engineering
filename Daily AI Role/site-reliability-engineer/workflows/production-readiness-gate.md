# Workflow: Production Readiness Gate

## Trigger
New service, major architecture change, new critical dependency, significant traffic increase, or risky production migration.

## Stages
1. Intake service/change contract and owner.
2. Run architecture/dependency and SLO reviews in parallel.
3. Run capacity, observability, rollout/rollback, and recovery checks in parallel where independent.
4. Consolidate findings by failure mode and user impact.
5. Reliability Reviewer independently checks blockers and evidence.
6. Owners fix findings; maximum two review-fix cycles before escalation to engineering leadership for scope/risk decision.
7. Human owner approves explicit accepted risks.
8. Verification Agent checks required evidence.

## Verdicts
- `PASS`
- `PASS_WITH_APPROVED_RISK`
- `BLOCK`

## Definition of Done
Verdict explicit; blockers resolved or release blocked; accepted risks have owner/approver/deadline; dashboards/alerts/runbook/rollback evidence exists.