# Post-Release Validation Rules

## Purpose
Confirm that a release achieved its intended production outcome without hidden customer, operational, data, or integration regressions.

## Scope
Applies from deployment completion through release closure.

## MUST
- Release closure MUST require validation of predefined technical and business success criteria.
- Validation MUST cover affected critical paths, error/latency signals, dependencies, data integrity, and customer-impact indicators where relevant.
- Results MUST be compared against pre-release baselines or expected ranges when meaningful.
- Newly discovered material degradation MUST trigger triage and an explicit continue, contain, rollback, or incident decision.
- Residual issues and deferred follow-up MUST have accountable owners before release closure.

## MUST NOT
- Successful deployment execution MUST NOT be equated with successful release validation.
- A release MUST NOT be closed while mandatory validation is still pending without an approved exception and monitoring owner.
- Known regressions MUST NOT be omitted from final status because they fall outside the implementing team's component.

## SHOULD
- Validation SHOULD include representative user journeys or synthetic checks in addition to infrastructure health.
- Observation duration SHOULD reflect delayed failure modes and traffic patterns relevant to the change.

## Exceptions
Early closure requires documented reason, incomplete evidence, residual risk, ongoing monitoring, owner, and approval appropriate to release risk.

## Verification
Review post-release check results, telemetry, business KPIs, incident/defect records, data checks, dependency health, observation duration, and closure approvals.