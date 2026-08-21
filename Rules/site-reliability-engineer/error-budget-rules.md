# Error Budget Rules

## Purpose
Use error budgets to balance reliability work with feature delivery and operational risk.

## Scope
Applies to services with defined SLOs and teams making release, reliability, or risk decisions.

## MUST
- Error budget consumption MUST be derived from the approved SLO calculation.
- Teams MUST define actions for healthy, elevated, and exhausted error-budget states.
- Material budget burn MUST influence release and remediation priorities.
- Budget policy changes MUST be reviewed with service owners.

## MUST NOT
- MUST NOT treat an exhausted error budget as informational only when the policy requires intervention.
- MUST NOT reset or reinterpret the budget merely to permit planned releases.
- MUST NOT punish teams for reporting legitimate reliability failures.

## SHOULD
- Prefer policies that create predictable decision rules before incidents occur.
- High-risk launches SHOULD consider recent burn rate in addition to remaining budget.

## Exceptions
An exception to an error-budget policy requires explicit business justification, accountable approval, bounded duration, mitigation, and rollback criteria.

## Verification
Inspect SLO data, burn-rate calculations, release decisions, incident history, and approvals for exceptions.