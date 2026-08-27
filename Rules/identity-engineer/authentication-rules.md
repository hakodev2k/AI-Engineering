# Authentication
## Purpose
Ensure identities are authenticated with strength proportional to risk.
## Scope
Interactive and non-interactive authentication.
## MUST
- Authentication methods MUST meet the threat model and assurance requirement of the protected resource.
- High-risk operations MUST require phishing-resistant or step-up authentication where supported by the risk model.
- Authentication failures MUST be observable without exposing credentials or sensitive factors.
## MUST NOT
- Passwords, tokens, recovery codes, or private keys MUST NOT be logged.
- Authentication controls MUST NOT be weakened to bypass an integration failure without approval.
## SHOULD
- Prefer modern standards and phishing-resistant authenticators.
## Exceptions
Require documented risk, duration, compensating controls, and owner approval.
## Verification
Inspect policy configuration, protocol traces, negative tests, security tests, and audit events.