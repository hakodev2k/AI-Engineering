# Remote Access Security
## Purpose
Protect remote administrative and workforce access.
## Scope
VPN, ZTNA, bastions, remote administration, and third-party access.
## MUST
- Remote access MUST authenticate users and devices according to risk.
- Privileged access MUST use stronger controls than ordinary user access.
- Third-party access MUST be scoped, attributable, reviewed, and revocable.
- Sessions to sensitive environments MUST generate sufficient audit evidence.
## MUST NOT
- Shared remote-access credentials MUST NOT be used.
- Management interfaces MUST NOT be broadly exposed to the public Internet.
## SHOULD
- Access SHOULD be context-aware and short-lived where supported.
## Exceptions
Require security approval, bounded duration, compensating controls, and monitoring.
## Verification
Inspect identity policy, tunnel/ZTNA policy, device posture, logs, session records, and exposure scans.