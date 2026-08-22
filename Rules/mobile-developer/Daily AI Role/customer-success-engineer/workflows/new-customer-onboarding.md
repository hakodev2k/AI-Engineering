# Workflow: New Customer Onboarding

## Trigger
New account, new implementation, or major expansion.

## Goal
Reach verified first value through a safe, dependency-aware implementation path.

## Stages
1. **Intake** — primary role captures goals, stakeholders, constraints, target date, and success signals.
2. **Context validation** — Integration Investigator reviews architecture and prerequisites; Adoption Analyst defines measurement baseline. These may run in parallel.
3. **Plan** — primary role builds milestones and dependency order using `templates/success-plan.md`.
4. **Readiness checkpoint** — review security, permissions, product fit, integrations, owners, and approvals.
5. **Execute** — coordinate configuration/integration work; primary role tracks blockers and evidence.
6. **Pilot verification** — verify expected workflow and first-value signal.
7. **Adoption handoff** — establish ongoing health metrics, enablement, owners, and review cadence.
8. **Close** — verify Definition of Done.

## Dependencies
Security/access prerequisites and product capability validation block production recommendation. Independent documentation and telemetry work may run concurrently.

## Checkpoints
After context validation, before production-impacting actions, after pilot, and before closure.

## Retry policy
Two equivalent retries maximum for a failed technical step. New evidence may justify a different path.

## Failure path
Record evidence → classify blocker → assign owner → escalate with cost of delay → update plan.

## Definition of Done
Success plan exists; prerequisites are validated; first-value evidence exists; risks are owned; ongoing health measurement and handoff are accepted.