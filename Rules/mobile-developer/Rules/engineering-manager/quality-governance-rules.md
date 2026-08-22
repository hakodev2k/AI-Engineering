# Quality Governance Rules
## Purpose
Maintain engineering quality through enforceable standards and evidence.
## Scope
Testing, code review, defects, maintainability, and release quality.
## MUST
- Define minimum quality gates appropriate to system risk and ensure exceptions are visible.
- Require regression protection for critical defect fixes where practical.
- Track recurring quality failures to systemic causes and corrective actions.
## MUST NOT
- Remove meaningful tests or review controls solely to make a deadline.
- Treat passing CI as sufficient evidence for all production risks.
## SHOULD
- Automate deterministic checks and reserve human review for judgment-heavy risks.
## Exceptions
Emergency bypasses require owner, rationale, compensating validation, and follow-up.
## Verification
Inspect CI gates, test evidence, review records, defect trends, exceptions, and remediation actions.