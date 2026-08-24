# Security and Privacy Rules

## Purpose
Protect credentials, user data, platform trust boundaries, and privacy expectations.

## Scope
Authentication, authorization, storage, networking, logging, permissions, cryptography, and privacy-sensitive features.

## MUST
- Secrets and long-lived credentials MUST use platform-secure storage or server-side custody as appropriate.
- Authorization MUST be enforced by trusted services; client-side checks may improve UX but MUST NOT be the security boundary.
- Collected data and requested permissions MUST be limited to documented product need.
- Sensitive data MUST be redacted from logs, analytics, crash metadata, screenshots, and diagnostics where applicable.
- Security-sensitive changes MUST include abuse/failure analysis and verification evidence.

## MUST NOT
- MUST NOT embed production secrets in source, bundles, or remotely retrievable client configuration.
- MUST NOT implement custom cryptography when vetted platform primitives satisfy the requirement.
- MUST NOT weaken transport security, entitlement restrictions, or permission controls merely to unblock delivery.

## SHOULD
- Prefer least privilege, data minimization, short-lived credentials, and secure defaults.
- Threat-model authentication, deep links, web views, local storage, and interprocess entry points.

## Exceptions
Any weakening of a security control requires explicit authorized human approval, documented risk, compensating controls, and expiry/review date.

## Verification
Use secret scanning, entitlement/configuration inspection, penetration testing where warranted, dependency scanning, privacy review, and tests for authorization and redaction.