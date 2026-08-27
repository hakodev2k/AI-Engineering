# Security Resilience Rules

## Purpose
Preserve security controls and trustworthy recovery during operational stress and partial failure.

## Scope
Applies to authentication, authorization, secrets, certificates, encryption, audit, emergency access, and security dependencies.

## MUST
- Resilience designs MUST analyze failure of identity, secret, certificate, and policy-distribution dependencies where they are critical.
- Emergency access MUST be tightly controlled, auditable, time-bounded, and tested without exposing reusable credentials.
- Security-sensitive caches or fallbacks MUST define freshness and revocation behavior.
- Recovery procedures MUST preserve authorization boundaries and auditability.
- Security control degradation MUST require explicit risk acceptance and authorized human approval when it weakens protection.

## MUST NOT
- MUST NOT disable authentication, authorization, TLS validation, or audit controls merely to restore availability.
- MUST NOT embed emergency credentials in source code, runbooks, or logs.
- MUST NOT fail open unless that behavior is explicitly designed, risk-assessed, and approved.

## SHOULD
- Critical security dependencies SHOULD have independent recovery paths and monitored expiry margins.
- Break-glass mechanisms SHOULD be tested periodically with post-use review.

## Exceptions
Safety-critical emergency operation may justify a documented alternative control, but the scope, duration, evidence, and approver MUST be recorded.

## Verification
Inspect failure modes, access policy, certificate and secret dependencies, emergency procedures, audit trails, and fault tests. Confirm resilience controls do not silently bypass security.