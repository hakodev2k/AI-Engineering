# Security Risk Assessment Rules

## Purpose
Ensure security decisions are based on explicit, reviewable risk rather than intuition alone.

## Scope
Applies to vulnerabilities, exceptions, architecture choices, control gaps, third-party dependencies, and production security decisions.

## MUST
- Security risks MUST identify affected assets, threat or failure scenario, likelihood factors, impact, existing controls, and residual risk.
- Risk acceptance MUST name an accountable owner with authority over the affected business risk.
- High and critical residual risks MUST require explicit approval and a defined treatment plan or review date.
- Material assumptions MUST be documented and revisited when evidence changes.
- Risk ratings MUST be consistent enough to compare priorities across systems.

## MUST NOT
- MUST NOT use vague labels such as low or high without supporting rationale for material decisions.
- MUST NOT let delivery urgency silently substitute for risk acceptance.
- MUST NOT treat security-team confidence as evidence by itself.

## SHOULD
- Prefer evidence from incidents, exposure, exploitability, architecture, telemetry, and control effectiveness.
- Separate inherent risk from residual risk when useful.

## Exceptions
Lightweight assessment is acceptable for clearly low-impact changes when rationale is recorded.

## Verification
Use risk registers, approval records, threat models, vulnerability evidence, architecture review, and periodic reassessment.