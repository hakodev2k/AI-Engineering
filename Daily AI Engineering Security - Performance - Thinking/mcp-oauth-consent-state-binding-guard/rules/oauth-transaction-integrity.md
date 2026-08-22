# OAuth Transaction Integrity Rules

- The implementation **MUST** create `state` with cryptographically secure randomness.
- The implementation **MUST NOT** persist consent-bound transaction state before the user has explicitly approved the downstream MCP client.
- The persisted transaction **MUST** bind state to downstream client ID, exact redirect URI, requested resource/scopes, PKCE challenge, consent-session identity, issue time, expiry, and one-time-use status.
- Callback handling **MUST** reject missing, expired, replayed, cross-client, cross-session, redirect-mismatched, resource-mismatched, scope-mismatched, or PKCE-mismatched transactions before exchanging or forwarding credentials.
- Authorization URLs from MCP metadata **MUST** be treated as untrusted input.
- Production authorization URLs **MUST** use HTTPS. HTTP **MAY** be accepted only for loopback development/callback scenarios explicitly permitted by policy.
- `javascript:`, `data:`, `file:`, `vbscript:` and unknown schemes **MUST** be rejected.
- Clients **MUST NOT** open authorization URLs by interpolating them into a shell command.
- Loopback OAuth flows **MUST** prove the intended callback listener is bound and ready before opening the authorization URL.
- State values **MUST** be single-use and **SHOULD** expire within 10 minutes unless a shorter policy is practical.
- Logs **MUST NOT** contain authorization codes, access tokens, refresh tokens, PKCE verifier values, cookies, or raw state values.
- Security tests **MUST** include replay, wrong-client, wrong-session, wrong-redirect, dangerous-scheme, expired-state, and missing-listener cases.
- A high-risk OAuth security change **MUST** be verified by a reviewer/subagent other than the implementer.
- The implementation **MUST NOT** disable PKCE, consent binding, redirect validation, or state checks to recover from interoperability failures.
- Unknown or inconsistent transaction state **MUST** fail closed.
