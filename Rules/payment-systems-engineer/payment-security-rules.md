# Payment Security Rules

## Purpose
Protect payment operations, credentials, and sensitive financial data against misuse and compromise.

## Scope
Payment APIs, provider credentials, service-to-service calls, operator tools, and financial data stores.

## MUST
- Payment operations MUST enforce authentication and authorization at the financial action boundary.
- Provider credentials and signing secrets MUST be stored in approved secret-management systems and rotated under controlled procedures.
- Sensitive payment data MUST be minimized, classified, encrypted in transit, and protected at rest according to applicable requirements.
- High-risk administrative actions MUST require stronger controls such as privileged access, step-up authentication, or dual approval.
- Security-relevant events MUST be auditable with actor, action, target, result, and correlation context.

## MUST NOT
- MUST NOT log full payment credentials, authentication secrets, or prohibited card data.
- MUST NOT bypass authorization or signature validation to resolve production incidents.
- MUST NOT expose provider admin capabilities through broadly accessible application credentials.

## SHOULD
- Payment services SHOULD use least-privilege identities and network boundaries.

## Exceptions
Exceptions require security review, documented risk, compensating controls, expiry, and owner approval.

## Verification
Inspect IAM policies, secret references, logs, encryption configuration, privileged-action controls, and security tests.