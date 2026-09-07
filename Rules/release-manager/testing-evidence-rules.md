# Testing Evidence Rules

## Purpose
Require release decisions to use relevant, current, inspectable validation evidence.

## Scope
Applies to unit, integration, end-to-end, regression, performance, resilience, compatibility, and manual acceptance evidence required by release risk.

## MUST
- Required test classes MUST be selected from release scope and risk, not a fixed checklist alone.
- Test evidence MUST identify candidate version, environment, execution time, result, and unresolved failures.
- Critical-path regressions and known high-risk failure modes MUST have explicit validation before production approval.
- Failed or skipped mandatory tests MUST be treated as blockers or approved exceptions.
- Retesting MUST occur when changes invalidate prior evidence.

## MUST NOT
- A green aggregate status MUST NOT hide relevant failed, quarantined, or skipped tests.
- Flaky tests MUST NOT be repeatedly rerun until green and then treated as reliable evidence without investigation.
- Unrepresentative test environments MUST NOT be presented as production-equivalent without stating limitations.

## SHOULD
- Evidence SHOULD prioritize deterministic automated checks while retaining expert manual validation where automation is insufficient.
- Historical defect patterns SHOULD inform regression selection.

## Exceptions
Reduced testing requires documented urgency, omitted coverage, risk, compensating validation, accountable approval, and post-release monitoring.

## Verification
Inspect test reports, CI executions, candidate identifiers, skipped/quarantined tests, environment assumptions, defect status, and exception approvals.