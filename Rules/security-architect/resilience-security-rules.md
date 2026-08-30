# Security Resilience Rules

## Purpose
Ensure security controls remain effective or fail safely during outages, attacks, dependency loss, and degraded operation.

## Scope
Identity, authorization, secrets, logging, network, data, control-plane, and dependency failures.

## MUST
- Critical security dependencies MUST have defined failure behavior and recovery objectives.
- Degraded modes MUST preserve essential authorization, tenant isolation, and data-protection boundaries.
- Availability trade-offs that bypass security controls MUST be explicitly risk-assessed and approved.
- Recovery designs MUST protect backups, credentials, and control planes from the same compromise domain where feasible.
- Security controls required for incident containment MUST remain operable during partial system failure.

## MUST NOT
- MUST NOT fail open for privileged access merely because an identity or policy service is unavailable unless explicitly approved.
- MUST NOT rely on a single control-plane credential or recovery path for critical systems.
- MUST NOT assume backups are trustworthy without integrity and restoration validation.

## SHOULD
- Prefer independent recovery credentials, tested break-glass procedures, segmented backups, and graceful secure degradation.

## Exceptions
Require documented availability impact, residual security risk, compensating controls, bounded duration, and approval.

## Verification
Review failure-mode analysis, chaos or resilience tests, backup restoration evidence, break-glass tests, and degraded-mode behavior.