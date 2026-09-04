# MFA and Phishing Resistance Rules

## Purpose
Reduce account takeover risk through strong multi-factor authentication and resistant enrollment and recovery controls.

## Scope
Applies to privileged users, administrators, sensitive applications, remote access, and elevated-risk identities.

## MUST
- High-impact administrative access MUST use phishing-resistant MFA where supported.
- MFA enrollment and factor replacement MUST require identity verification appropriate to account risk.
- Factor reset events MUST be auditable and observable.
- Backup factors MUST not materially weaken the required assurance level without documented exception.

## MUST NOT
- SMS or email possession alone MUST NOT be treated as phishing-resistant authentication.
- MFA bypasses MUST NOT be permanent or undocumented.
- Help-desk procedures MUST NOT permit factor resets based solely on easily discoverable personal information.

## SHOULD
- Prefer hardware-backed or device-bound authenticators for privileged identities.
- Risky factor changes SHOULD trigger additional review or notification.

## Exceptions
Exceptions require scope, duration, compensating controls, risk acceptance, and approval by the accountable security owner.

## Verification
Inspect MFA policy, enrollment workflows, reset procedures, privileged-account samples, authentication logs, and controlled phishing-resistance tests.