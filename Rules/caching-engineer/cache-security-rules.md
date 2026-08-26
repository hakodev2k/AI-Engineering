# Cache Security

## Purpose
Protect cached data, control plane, and transport from unauthorized access.

## Scope
Authentication, authorization, network exposure, encryption, administration, and secure defaults.

## MUST
- Cache endpoints MUST be authenticated and network-restricted according to trust boundaries.
- Administrative access MUST use least privilege and auditable identities.
- Sensitive cached data MUST use transport and storage protections appropriate to its classification and threat model.
- Security-relevant configuration MUST be managed through reviewed, reproducible mechanisms.

## MUST NOT
- Production caches MUST NOT be exposed to untrusted networks without an explicitly reviewed security architecture.
- Default credentials, anonymous administration, or broad shared admin identities MUST NOT be used.
- Security controls MUST NOT be weakened merely to resolve connectivity or performance issues.

## SHOULD
- Separate data-plane and administrative privileges.
- Prefer private connectivity and short-lived credentials where supported.

## Exceptions
Security exceptions require threat analysis, compensating controls, expiry, verification, and authorized approval.

## Verification
Inspect IAM, network policy, TLS configuration, audit logs, vulnerability scans, penetration-test evidence, and configuration drift.