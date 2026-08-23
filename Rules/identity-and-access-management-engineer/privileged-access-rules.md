# Privileged Access Rules

## Purpose
Control administrative access that can materially affect security, production, identities, or sensitive data.

## Scope
Privileged accounts, administrative roles, break-glass access, elevation, and privileged sessions.

## MUST
- Privileged identities MUST be distinct from routine user identities where the platform supports separation.
- Privileged elevation MUST require explicit authorization and stronger authentication.
- Privileged sessions MUST be attributable to an individual or uniquely owned workload.
- Break-glass access MUST be tightly controlled, monitored, tested, and reviewed after use.
- High-risk administrative actions MUST produce durable audit evidence.

## MUST NOT
- MUST NOT share privileged credentials between people.
- MUST NOT use permanent global-administrator access when task-scoped elevation is available.
- MUST NOT disable privileged-session controls merely to accelerate troubleshooting.

## SHOULD
- Privileged access SHOULD be time-bounded and brokered through PAM or equivalent controls.
- Sensitive administrative workflows SHOULD require step-up authentication or dual control.

## Exceptions
Exceptions require security approval, scope, reason, monitoring, expiry, and post-use review.

## Verification
Inspect privileged role assignments, elevation logs, PAM records, break-glass tests, session evidence, and samples of high-risk administrative changes.