# Regression Testing Rules

## Purpose
Prevent prompt changes from silently degrading established behavior.

## Scope
Prompt edits, template changes, model upgrades, tool changes, retrieval changes, and context-policy changes.

## MUST
- Every material change MUST run the relevant regression suite before production release.
- Previously fixed prompt failures MUST be represented by durable regression cases unless the underlying requirement was intentionally removed.
- Regressions in safety-critical or contract-critical behavior MUST block release until explicitly resolved or approved.
- Test results MUST identify the prompt version, model version, and relevant runtime configuration.

## MUST NOT
- MUST NOT delete failing tests solely to restore a passing score.
- MUST NOT compare runs with materially different settings without documenting the difference.
- MUST NOT declare equivalence from aggregate scores when critical slices regress.

## SHOULD
- Regression suites SHOULD track both overall quality and important behavioral slices.
- Flaky or nondeterministic cases SHOULD use repeated sampling and statistically meaningful thresholds.

## Exceptions
A known regression may be accepted only with documented impact, compensating controls, owner approval, and a follow-up plan.

## Verification
Inspect CI or evaluation records, version metadata, critical-slice reports, and accepted-regression approvals.