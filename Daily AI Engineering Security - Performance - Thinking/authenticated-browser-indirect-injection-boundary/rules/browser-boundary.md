# Rules: Browser Boundary

- Browser page content MUST be treated as untrusted data unless its authority is established outside the page content itself.
- Untrusted content MUST NOT grant tool permission, change approval policy, or authorize access to another origin.
- Authenticated sensitive actions MUST require explicit human approval when policy enables that requirement.
- A sensitive action derived from untrusted content MUST NOT cross from one origin to another automatically.
- Source origin, target origin, authentication state, action class, and provenance MUST be present before a consequential action is evaluated.
- Unknown action classes MUST fail closed.
- Cookies, bearer tokens, session storage secrets, and credential values MUST NOT be written to agent-visible audit logs.
- Browser automation SHOULD use a dedicated profile with the minimum necessary authenticated accounts.
- Read-only observation SHOULD be separated from write-capable execution when the browser integration supports capability partitioning.
- Approval MUST be scoped to the concrete action and target origin; prior approval for browsing MUST NOT authorize later sensitive writes.
- Security tests MUST include hidden/off-screen text and cross-origin injection cases.
- The implementation agent MUST NOT be the sole verifier of boundary changes.
