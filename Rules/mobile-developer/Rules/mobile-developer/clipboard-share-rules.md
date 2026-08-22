# Clipboard and Sharing Rules
## Purpose
Prevent accidental disclosure when data crosses application boundaries.
## Scope
Clipboard, share sheets, exported files, screenshots, drag/drop, and inter-app handoff.
## MUST
- Shared/exported content MUST be limited to the user's intended scope and current authorization.
- Temporary exported sensitive files MUST have controlled lifetime and storage location.
- Clipboard use for sensitive values MUST be deliberate and follow platform privacy capabilities where available.
## MUST NOT
- Secrets or authentication tokens MUST NOT be automatically copied or shared.
- Internal file paths or privileged URIs MUST NOT be exposed when recipients require a safe content grant instead.
## SHOULD
- Prefer explicit user-triggered sharing over silent cross-app transfer.
## Exceptions
Enterprise-managed workflows may automate sharing within an approved controlled boundary.
## Verification
Inspect share payloads, URI permissions, temporary files, clipboard behavior, account switching, and receiving-app access.