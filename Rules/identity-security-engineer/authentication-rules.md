# Authentication Rules

## Purpose
Define secure authentication requirements proportional to identity and resource risk.

## Scope
Applies to interactive and non-interactive authentication flows.

## MUST
- Authentication strength MUST be selected from documented threat and assurance requirements.
- Credential validation MUST occur only over protected channels and trusted components.
- Authentication failures MUST be rate-limited or otherwise protected against automated abuse.
- Recovery flows MUST provide assurance appropriate to the account's privilege and impact.
- Changes to authentication policy MUST be tested against bypass, lockout, and recovery scenarios.

## MUST NOT
- Authentication secrets MUST NOT be logged, exposed in URLs, or stored in reversible plaintext form.
- Security controls MUST NOT be disabled merely to resolve integration failures.
- Successful possession of one weak factor MUST NOT be treated as strong assurance without evidence.

## SHOULD
- Prefer phishing-resistant authentication for high-risk users and sensitive systems.
- Prefer adaptive controls only when signals and failure behavior are measurable.

## Exceptions
Exceptions require documented business need, risk, duration, compensating controls, and approval.

## Verification
Review identity-provider policy, protocol traces, penetration tests, recovery tests, rate-limit behavior, and authentication telemetry.