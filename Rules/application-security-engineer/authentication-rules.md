# Authentication Rules

## Purpose
Ensure identities are established with controls proportional to account value, attacker capability, and recovery risk.

## Scope
Applies to human users, administrators, workloads, service identities, authentication factors, enrollment, recovery, and credential lifecycle.

## MUST
- Authentication MUST use maintained, well-reviewed protocols and libraries appropriate to the platform.
- Administrative and other high-impact access MUST require stronger authentication appropriate to the risk.
- Credential verification, token validation, issuer/audience checks, expiry, and signature validation MUST occur at trusted server-side boundaries.
- Enrollment and account recovery MUST be treated as authentication flows and protected against takeover.
- Authentication failures MUST avoid disclosing unnecessary account-existence or credential-state information.
- Service identities MUST be scoped, attributable, rotatable, and separated by environment or trust boundary where compromise impact differs.

## MUST NOT
- MUST NOT invent custom password hashing, token signing, or authentication protocols.
- MUST NOT place reusable credentials in source code, URLs, client-visible configuration, or logs.
- MUST NOT disable authentication controls to unblock testing in shared or production environments.

## SHOULD
- SHOULD prefer phishing-resistant factors for privileged access where supported.
- SHOULD use short-lived workload credentials instead of long-lived static secrets.

## Exceptions
Exceptions require threat analysis, compensating controls, bounded duration, evidence, and approval by the accountable security owner.

## Verification
Inspect protocol configuration, token-validation code, recovery paths, credential storage, negative tests, MFA enforcement, secret scanning, and authentication telemetry. Test malformed, expired, replayed, wrong-audience, and wrong-issuer credentials.