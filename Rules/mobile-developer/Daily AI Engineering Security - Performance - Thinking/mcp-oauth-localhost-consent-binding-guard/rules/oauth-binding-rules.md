# OAuth Binding Rules

- Every MCP authorization request MUST create a short-lived transaction binding before browser redirection.
- The binding MUST include the exact client ID, client-metadata hash, redirect URI, issuer, protected resource, scopes, PKCE method/challenge hash, state hash, browser-session hash, consent status, creation time, expiry time, and used flag.
- Raw authorization codes, access tokens, refresh tokens, PKCE verifiers, state values, browser cookies, and session secrets MUST NOT be persisted in audit logs.
- PKCE S256 MUST be required when configured and MUST NOT be downgraded automatically.
- Callback handling MUST validate the exact redirect URI; prefix, suffix, wildcard, or partial matching MUST NOT be used.
- Callback handling MUST verify the authorization-server issuer and protected resource against the originating transaction.
- Callback handling MUST verify state and browser-session correlation before code forwarding or token exchange.
- A transaction MUST be single-use and MUST be marked consumed atomically before a code is forwarded downstream.
- Expired, replayed, missing, or mismatched transactions MUST be denied.
- Loopback redirects MUST be classified separately from HTTPS web redirects.
- Loopback authorization MUST require an explicit consent step when policy requires it.
- A Client ID Metadata Document MUST NOT be treated as proof of ownership of the local callback process.
- Production exceptions for loopback, attestation, PKCE, issuer, resource, or redirect checks MUST require explicit human security approval.
- The implementation agent MUST NOT be the sole verifier for changes that affect authorization-code or token handling.
- Tests SHOULD include replay, redirect substitution, issuer mix-up, resource mix-up, changed client metadata, state mismatch, browser-session mismatch, expired transaction, missing consent, and valid-flow fixtures.
- Security failures MUST stop the current authorization transaction; they MUST NOT trigger unbounded automatic retries.