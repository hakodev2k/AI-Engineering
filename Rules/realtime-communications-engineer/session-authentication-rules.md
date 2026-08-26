# Session Authentication and Authorization Rules

## Purpose
Ensure only authorized identities can create, join, or control sessions.

## Scope
Session tokens, room membership, publishing/subscribing permissions, signaling authorization, and revocation.

## MUST
- Every privileged session action MUST be authorized server-side against current identity and session state.
- Join/publish/control credentials MUST be scoped and time-bounded.
- Revocation MUST take effect within a documented operational bound.
- Authorization decisions MUST be auditable without logging secrets.

## MUST NOT
- MUST NOT rely on client UI state as authorization.
- MUST NOT use guessable room identifiers as access control.
- MUST NOT grant wildcard media-control permissions by default.

## SHOULD
- Permissions SHOULD follow least privilege and separate join, publish, subscribe, moderate, and administrative capabilities.

## Exceptions
Elevated access requires documented owner, purpose, duration, and approval.

## Verification
Use authorization tests, token inspection, revocation tests, audit-log review, and abuse-case testing.