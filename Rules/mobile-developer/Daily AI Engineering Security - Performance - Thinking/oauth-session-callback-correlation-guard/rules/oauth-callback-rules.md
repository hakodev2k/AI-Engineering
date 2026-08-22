# OAuth Callback Correlation Rules

- Every OAuth authorization start MUST create a distinct transaction record with a cryptographically random state value or state hash.
- A transaction MUST bind the initiating session/security context, provider or issuer, redirect URI, creation time, expiry, and PKCE metadata when used.
- Callback routing MUST use the transaction identified by validated state; it MUST NOT use current window focus, last active session, current tab, or a mutable singleton pending-flow pointer.
- Concurrent flows MUST NOT overwrite each other's pending transaction records.
- State MUST be single-use. A consumed transaction MUST reject replay.
- Transaction consumption and target-session mutation SHOULD occur atomically or under one compare-and-swap/transaction boundary.
- Unknown, expired, replayed, issuer-mismatched, redirect-mismatched, or detached-session callbacks MUST be rejected before token/connection state is committed.
- Authorization codes, access tokens, refresh tokens, cookies, PKCE verifiers, and secrets MUST NOT be written to diagnostic logs.
- Audit events SHOULD contain only transaction ID/hash prefix, result code, initiating/target session IDs, issuer identifier, and timestamps.
- If safe concurrent callback routing is unavailable, the client MUST reject a second concurrent flow clearly rather than silently reassigning the first.
- Device-code or another non-loopback flow MAY be offered for remote/multi-instance environments, but MUST NOT weaken account/session binding.
- A successful callback MUST update exactly one intended initiating session.