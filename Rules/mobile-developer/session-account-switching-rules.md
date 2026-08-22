# Session and Account Switching Rules
## Purpose
Prevent data leakage and state confusion when users log out, switch accounts, or change organizations/profiles.
## Scope
Caches, local databases, navigation, background jobs, notifications, analytics, and pending requests.
## MUST
- Account-scoped local state MUST be partitioned or cleared so one identity cannot observe another's data.
- In-flight requests and queued work MUST bind to the identity/context that authorized them and be cancelled or revalidated on switch.
- Navigation MUST leave privileged screens when authorization context changes.
## MUST NOT
- Cached responses, images, search history, or notifications containing private data MUST NOT cross account boundaries.
- A token refresh for an old account MUST NOT overwrite credentials for the new account.
## SHOULD
- Account transition SHOULD be modeled as an explicit state change with deterministic cleanup.
## Exceptions
Public shared caches may persist when they contain no identity-specific or sensitive data.
## Verification
Rapidly switch accounts during requests, background work, push delivery, offline mode, process restart, and cache reuse.