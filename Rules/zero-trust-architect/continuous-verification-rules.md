# Continuous Verification Rules

## Purpose
Ensure trust is continuously reassessed during sessions and long-lived interactions rather than granted indefinitely at login.

## Scope
Applies to user sessions, privileged sessions, APIs, service sessions, remote access, and persistent connections.

## MUST
- Sensitive sessions MUST have defined maximum lifetime, idle timeout, and reauthentication triggers appropriate to risk.
- Policy engines MUST be able to revoke or restrict access when identity, device, credential, risk, or entitlement state materially changes.
- High-risk operations MUST require fresh authorization context and, when appropriate, step-up authentication.
- Long-lived sessions MUST periodically refresh claims or re-evaluate authorization rather than relying indefinitely on stale state.
- Revocation behavior MUST be tested for disabled users, compromised devices, expired credentials, and removed entitlements.
- Session state and reauthentication events MUST be auditable.

## MUST NOT
- A successful initial authentication MUST NOT grant unbounded trust for the lifetime of an application session.
- Revoked identities or devices MUST NOT retain access solely because a previously issued session token has not naturally expired when revocation mechanisms exist.
- Sensitive authorization decisions MUST NOT use stale risk signals beyond their defined freshness window.

## SHOULD
- Risk-based reauthentication SHOULD be preferred over unnecessarily frequent prompts that encourage insecure workarounds.
- Session-bound device or credential signals SHOULD be used where practical.
- High-value administrative sessions SHOULD be short-lived and isolated.

## Exceptions
Exceptions require a documented technical limitation, risk assessment, compensating controls, owner, expiry, and approval.

## Verification
Inspect token and session lifetimes, revocation mechanisms, risk-signal freshness, policy refresh behavior, authentication logs, and automated tests that change subject or device state during active sessions.