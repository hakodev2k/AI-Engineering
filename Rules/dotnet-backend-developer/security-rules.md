# Security Rules

## Purpose
Define secure-by-default engineering behavior for backend systems.

## Scope
Applies to code, configuration, dependencies, data handling, external integrations, and production operations.

## MUST
- Untrusted input MUST be validated according to context before use.
- Sensitive data MUST be classified and protected in transit, at rest, and in logs according to project requirements.
- Secrets MUST come from approved secret stores or secure environment mechanisms.
- Security-sensitive changes MUST be reviewed for threat impact and least privilege.
- Dependency vulnerabilities with credible impact MUST be assessed and remediated or explicitly risk-accepted.
- Security controls MUST fail safely when dependencies or configuration are missing.

## MUST NOT
- MUST NOT hard-code secrets, credentials, private keys, or production tokens.
- MUST NOT weaken TLS, authorization, validation, or security controls merely to unblock delivery.
- MUST NOT log sensitive credentials or tokens.
- MUST NOT trust external data solely because it originates from an authenticated integration.

## SHOULD
- Prefer secure framework defaults and well-maintained libraries.
- Threat-model high-risk flows involving identity, money, sensitive data, file processing, or code execution.

## Exceptions
Security exceptions require documented threat/risk analysis, compensating controls, owner, expiry/review date, and human approval.

## Verification
Use code review, SAST, dependency scanning, secret scanning, security tests, configuration inspection, and targeted penetration testing where justified.