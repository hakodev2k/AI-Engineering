# Authentication and Session Rules
## Purpose
Handle identity and session state without creating client-side security assumptions.
## Scope
Login/logout UI, tokens, cookies, session expiry, reauthentication, and identity state.
## MUST
- Authorization MUST be enforced by trusted backend boundaries; frontend checks are presentation controls only.
- Session expiration and authentication failures MUST transition the UI to a defined safe state.
- Authentication artifacts MUST use the approved storage and transport design.
- Logout MUST clear client-held sensitive session state that the application owns.
- Reauthentication MUST be required when the authoritative security design demands it for sensitive operations.
## MUST NOT
- Long-lived secrets MUST NOT be embedded in frontend bundles.
- UI visibility MUST NOT be used as evidence that an action is authorized.
## SHOULD
- Minimize token exposure to JavaScript when the architecture permits safer mechanisms.
## Exceptions
Alternative session designs require security review and documented threat model.
## Verification
Inspect bundle/configuration, browser storage, cookies, network behavior, expiry tests, and server authorization tests.