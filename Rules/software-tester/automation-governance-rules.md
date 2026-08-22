# Automation Governance Rules

## Purpose
Use automation where it creates reliable, maintainable quality evidence.
## Scope
Automated test selection, ownership, review, and lifecycle from a tester perspective.
## MUST
- Automate only when the oracle, setup, execution, and maintenance strategy are sufficiently deterministic.
- Treat failing automated checks as evidence requiring diagnosis, not automatic product defects.
- Assign ownership and remove or repair obsolete checks.
## MUST NOT
- Add retries to conceal nondeterministic failures without root-cause work.
- Measure automation success primarily by percentage of cases automated.
## SHOULD
- Prefer lower-cost test layers for behavior that does not require end-to-end validation.
## Exceptions
Temporary quarantine requires owner, reason, risk, and expiry/review point.
## Verification
Review flake rate, maintenance history, quarantines, failure triage, runtime, and defect detection value.