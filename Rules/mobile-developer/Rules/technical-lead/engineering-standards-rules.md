# Engineering Standards Rules
## Purpose
Keep standards enforceable, valuable, and aligned with system risk.
## Scope
Coding, repository, build, quality, documentation, and team engineering conventions.
## MUST
- Mandatory standards MUST have a clear purpose and observable compliance criteria.
- Critical standards SHOULD be automated when reliable tooling exists.
- Standard changes affecting many contributors MUST communicate migration and enforcement expectations.
## MUST NOT
- Create mandatory rules that conflict with explicit project requirements without resolving the conflict.
- Accumulate obsolete standards that no longer reflect supported architecture or tooling.
## SHOULD
- Prefer small stable standards over extensive preference-driven rule sets.
## Exceptions
Local exceptions require rationale and must not violate security or safety boundaries.
## Verification
Inspect CI checks, linters, architecture tests, repository guidance, exceptions, and recurring review findings.