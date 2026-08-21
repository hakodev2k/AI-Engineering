# Agent Security Rules
## Purpose
Protect agent systems from abuse, compromise, and unintended privilege.
## Scope
Identity, credentials, input, tools, connectors, and runtime security.
## MUST
- Apply least privilege to every agent identity and tool credential.
- Validate untrusted inputs at trust boundaries and isolate executable content.
- Protect secrets using approved secret stores and rotate exposed credentials.
## MUST NOT
- Log credentials, tokens, private keys, or sensitive authentication material.
- Disable security controls merely to unblock agent execution.
## SHOULD
- Threat-model prompt injection, confused-deputy behavior, data exfiltration, and tool abuse.
## Exceptions
Security exceptions require documented risk, compensating controls, owner, expiry, and approval.
## Verification
Use threat models, secret scanning, permission review, penetration tests, and adversarial evaluations.