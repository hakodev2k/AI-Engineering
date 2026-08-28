# Detection Tuning Rules

## Purpose
Reduce operational noise without weakening material threat coverage.

## Scope
Applies to thresholds, filters, suppressions, exclusions, scoring, and severity adjustments.

## MUST
- Tuning decisions MUST be based on reviewed alert evidence and measurable impact.
- Every persistent suppression or exclusion MUST record rationale, scope, owner, and review date.
- Tuning MUST evaluate both false-positive reduction and false-negative risk.
- High-severity rule tuning MUST preserve test cases for known malicious behavior.

## MUST NOT
- MUST NOT disable or broadly suppress a detection solely to meet alert-volume targets.
- MUST NOT allow temporary incident suppressions to become permanent without review.
- MUST NOT tune against a single noisy sample when broader population data is available.

## SHOULD
- Tuning SHOULD prefer precise contextual conditions over broad exclusions.
- Recurring false positives SHOULD drive telemetry or detection-design improvements where feasible.

## Exceptions
Exceptions require documented urgency, bounded duration, accountable approver, and compensating monitoring.

## Verification
Compare pre/post alert volume, precision samples, malicious replay results, exclusion inventories, and review dates.