# Technical Debt Rules
## Purpose
Keep mobile-specific debt visible before platform churn turns it into release, security, or compatibility risk.
## Scope
Deprecated APIs, old OS workarounds, architecture compromises, flaky tests, dependencies, and temporary flags.
## MUST
- Material debt MUST record impact, trigger for action, owner, and evidence sufficient for prioritization.
- Temporary compatibility workarounds MUST have removal conditions tied to supported OS/app versions.
- Security or store-policy debt with deadlines MUST be escalated before it can block release.
## MUST NOT
- Debt MUST NOT be described only as subjective code cleanliness when operational impact can be measured.
- Repeated incidents MUST NOT be patched indefinitely without evaluating systemic remediation.
## SHOULD
- Debt reduction SHOULD be bundled with adjacent feature work when it lowers change risk efficiently.
## Exceptions
Low-impact debt may remain unplanned when risk is consciously accepted and monitored.
## Verification
Review debt register, platform deadlines, incident recurrence, dependency age, flaky tests, and expired workarounds.