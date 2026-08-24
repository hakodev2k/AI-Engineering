# Authentication Rules

## Purpose
Ensure authentication provides evidence proportional to account and action risk.

## Scope
Interactive login, step-up authentication, service authentication, session establishment, recovery, and authentication policy.

## MUST
- Authentication strength MUST be selected from documented risk and assurance requirements.
- Privileged and sensitive operations MUST require phishing-resistant or otherwise approved strong authentication where supported.
- Authentication failures MUST be rate-limited and observable without disclosing whether a protected identity exists.
- Authentication context used for authorization MUST be cryptographically validated and freshness-bounded.

## MUST NOT
- MUST NOT rely on knowledge-based questions as the sole recovery factor.
- MUST NOT bypass MFA or equivalent controls merely to unblock access.
- MUST NOT accept unsigned, expired, wrong-audience, or wrong-issuer authentication assertions.

## SHOULD
- Prefer phishing-resistant authenticators and risk-based step-up over repeated password prompts.
- Minimize long-lived reusable credentials.

## Exceptions
Temporary exceptions require risk, scope, expiry, compensating controls, monitoring, and security approval.

## Verification
Inspect identity-provider policy, protocol validation, negative tests, recovery tests, audit events, and penetration-test evidence.