# Authentication Boundary Rules

- Every authenticated action MUST have one effective principal and a usable credential on the actual request path.
- UI/session “logged in” state MUST NOT be treated as proof that backend credentials are present.
- Raw access tokens, refresh tokens, API keys, cookies, actor biscuits, and authorization headers MUST NOT appear in reconciliation logs.
- Components SHOULD exchange only safe metadata: principal/account identifier, credential presence, expiry state, credential source/generation, and timestamps.
- Conflicting non-empty principals MUST block privileged operations.
- Missing or expired credentials MUST block authenticated dispatch until bounded recovery succeeds.
- The runtime MUST NOT silently fall back to a different account, API key, workspace, or credential class to hide an auth failure.
- A 401 retry MUST NOT be attempted when the request would still have no credential attached.
- Recovery MUST be bounded to one refresh attempt followed by at most one explicit re-auth transition.
- After recovery, component observations MUST be recollected; success cannot be inferred from a UI transition alone.
- Security verification SHOULD use a harmless identity/status endpoint before higher-impact operations when supported.
- Completion MUST distinguish `Implemented`, `Measured`, and `Verified`.