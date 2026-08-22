# Security Testing Rules

## Purpose
Require evidence that security controls behave as intended under realistic failure and abuse conditions.

## Scope
Applies to automated security tests, penetration tests, control validation, and adversarial review.

## MUST
- Security testing MUST focus on actual trust boundaries, privileged actions, sensitive data flows, and known threat scenarios.
- High-risk findings MUST be reproduced or otherwise supported by sufficient evidence before remediation is considered complete.
- Authorization, input handling, session management, and security-critical configuration MUST be tested where applicable.
- Regression tests SHOULD be added for repeatable security defects when they can prevent recurrence.
- Test environments and data MUST be handled safely and must not expose production secrets.

## MUST NOT
- MUST NOT treat scanner output as sufficient proof that a system is secure.
- MUST NOT perform destructive or production-impacting security tests without explicit authorization.
- MUST NOT close findings merely because exploitation was difficult in one test environment.

## SHOULD
- Combine automated and manual testing for high-risk systems.
- Test negative paths and abuse cases, not only valid user journeys.

## Exceptions
Reduced testing requires documented scope, risk rationale, compensating evidence, and security approval.

## Verification
Use test reports, reproducible evidence, CI results, penetration-test findings, remediation retests, and reviewer sign-off.