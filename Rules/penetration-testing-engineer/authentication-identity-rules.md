# Authentication and Identity Testing Rules

## Purpose
Assess whether identity proof, credential handling, session establishment, and account recovery resist realistic abuse.

## Scope
Covers login, MFA, federation, passwordless flows, recovery, enrollment, tokens, sessions, and service identities.

## MUST
- MUST map identity providers, trust relationships, authentication factors, recovery paths, and session issuance before testing bypass hypotheses.
- MUST use designated test identities unless explicit authorization permits other accounts.
- MUST test failure paths, factor binding, token validation, session invalidation, and recovery controls where applicable.
- MUST treat authentication tokens, cookies, recovery codes, private keys, and credentials as secrets.
- MUST minimize credential attempts and respect agreed lockout and rate limits.

## MUST NOT
- MUST NOT conduct uncontrolled password spraying, credential stuffing, or lockout-inducing activity.
- MUST NOT retain valid credentials longer than required by the engagement.
- MUST NOT place reusable secrets in screenshots, tickets, chat, source repositories, or final reports.
- MUST NOT weaken MFA or identity policy in production without explicit approval.

## SHOULD
- SHOULD test trust transitions between local, federated, and service identities.
- SHOULD verify logout, revocation, rotation, and recovery behavior, not only initial login.

## Exceptions
Testing real-user identities or high-volume credential defenses requires explicit owner approval, monitoring, limits, and recovery procedures.

## Verification
Review identity diagrams, test-account inventory, request logs, token metadata with secrets redacted, lockout telemetry, cleanup records, and reproduction evidence.