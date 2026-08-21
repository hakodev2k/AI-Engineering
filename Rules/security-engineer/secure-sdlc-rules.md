# Secure SDLC Rules

## Purpose
Embed security controls into the software lifecycle rather than relying on late-stage review.

## Scope
Applies to requirements, design, implementation, testing, release, and maintenance.

## MUST
- Security requirements MUST be identified for systems handling sensitive data or privileged operations.
- High-risk designs MUST receive security review before implementation is locked in.
- Security testing MUST be appropriate to the system risk and change scope.
- Security defects MUST have severity, owner, disposition, and remediation evidence.
- Release gates MUST prevent unresolved unacceptable security risk from silently reaching production.

## MUST NOT
- MUST NOT defer known critical security decisions until after release without explicit risk acceptance.
- MUST NOT treat passing automated scanners as proof of security.
- MUST NOT bypass security review solely to meet a delivery deadline.

## SHOULD
- Automate repeatable security checks in CI/CD.
- Provide secure defaults and reusable patterns to development teams.

## Exceptions
Exceptions require documented risk, business justification, compensating controls, owner, and expiry or review date.

## Verification
Use SDLC checklists, pull-request evidence, scanner results, threat models, test reports, release gates, and risk records.