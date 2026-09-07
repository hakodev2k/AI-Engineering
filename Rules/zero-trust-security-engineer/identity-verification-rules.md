# Identity Verification Rules

## Purpose
Ensure every human and machine identity is verified with strength proportional to the protected resource and current risk.

## Scope
Applies to authentication flows, identity providers, federation, MFA, account recovery, and machine identities.

## MUST
- Authentication strength MUST match resource sensitivity and threat exposure.
- High-risk or privileged access MUST require phishing-resistant MFA where supported.
- Identity lifecycle events MUST propagate promptly to enforcement systems.
- Account recovery MUST provide assurance comparable to normal authentication.

## MUST NOT
- MUST NOT accept stale, unverifiable, or unsigned identity assertions.
- MUST NOT rely on knowledge-based questions as the sole recovery control for sensitive access.
- MUST NOT share human identities between operators.

## SHOULD
- Authentication SHOULD be adaptive to risk signals without making authorization opaque.
- Identity proofing SHOULD be documented for sensitive roles.

## Exceptions
Weaker authentication requires explicit risk acceptance, compensating controls, bounded scope, and expiry.

## Verification
Review identity-provider policy, token validation, MFA enrollment, recovery workflows, authentication logs, and negative tests for forged, expired, replayed, or downgraded assertions.