# MFA and Passwordless
## Purpose
Reduce credential theft and account takeover risk.
## Scope
MFA enrollment, authenticators, passwordless methods, and step-up policy.
## MUST
- Authenticator enrollment and replacement MUST verify the subject at an assurance level appropriate to the account.
- Privileged and high-impact access MUST use MFA meeting the documented threat model.
- Lost-device and factor-reset flows MUST be treated as security-sensitive authentication events.
## MUST NOT
- Weak fallback factors MUST NOT silently defeat stronger primary policy.
- MFA bypasses MUST NOT be permanent or unowned.
## SHOULD
- Prefer phishing-resistant methods for privileged and high-risk populations.
## Exceptions
Require owner, justification, expiry, monitoring, and approval.
## Verification
Review policy, enrollment flows, bypass inventory, recovery tests, and authentication telemetry.