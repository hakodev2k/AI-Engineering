# Test Automation Governance Rules
## Purpose
Ensure automation provides trustworthy, maintainable feedback rather than false confidence.
## Scope
Automation selection, ownership, flakiness, CI gates, and maintenance.
## MUST
- Automate tests when repeatability, risk, frequency, and maintenance economics justify it.
- Treat flaky tests as defects with ownership and remediation or quarantine criteria.
- Ensure blocking automated checks are deterministic enough for their gate responsibility.
## MUST NOT
- Add retries that conceal reproducible product defects or uncontrolled test state.
- Measure automation success by percentage automated without considering risk coverage and signal quality.
## SHOULD
- Keep tests independent, diagnosable, and aligned with stable public behavior.
## Exceptions
Temporary quarantine requires reason, owner, risk, and removal target.
## Verification
Track flake rate, false failures, quarantines, gate effectiveness, maintenance cost, and escaped defects.