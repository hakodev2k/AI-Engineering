# Push Notification Rules
## Purpose
Use push messaging reliably without exposing sensitive data or creating duplicate side effects.
## Scope
Device tokens, notification payloads, routing, background handling, and user preferences.
## MUST
- Device-token rotation and invalidation MUST be handled without assuming tokens are permanent identities.
- Notification-triggered navigation/actions MUST validate current authorization and application state.
- Duplicate or delayed notifications MUST be safe to process.
## MUST NOT
- Sensitive content MUST NOT be included in notification payloads when lock-screen exposure violates privacy requirements.
- Delivery MUST NOT be treated as guaranteed or ordered.
## SHOULD
- Push SHOULD signal the client to fetch authoritative state when payload staleness is material.
## Exceptions
Low-risk informational content may be fully rendered from payload when privacy and staleness are acceptable.
## Verification
Test token refresh, duplicate/delayed messages, disabled notifications, logout/login changes, lock screen, and deep-link routing.