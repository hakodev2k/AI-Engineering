# Security Governance Rules
## Purpose
Make security an engineering constraint throughout delivery.
## Scope
Application design, identity, authorization, secrets, dependencies, data, and operational controls.
## MUST
- Threat-sensitive changes MUST identify trust boundaries, sensitive assets, abuse cases, and required controls.
- Access MUST follow least privilege and authorization MUST be enforced at trusted boundaries.
- Security findings MUST have explicit severity, owner, and disposition.
## MUST NOT
- Commit credentials, log secrets, or weaken controls merely to unblock delivery.
- Declare a security issue resolved without verification evidence.
## SHOULD
- Automate dependency, secret, and static security checks appropriate to the stack.
## Exceptions
Risk acceptance requires documented impact, compensating controls, expiry where appropriate, and authorized human approval.
## Verification
Inspect threat reviews, scanners, tests, configuration, permissions, findings, and approvals.