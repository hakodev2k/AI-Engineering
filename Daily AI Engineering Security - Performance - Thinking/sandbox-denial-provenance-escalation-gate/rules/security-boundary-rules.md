# Security Boundary Rules

- A sandbox denial MUST be represented as an authorization decision, not only as process stderr or exit status.
- The runtime MUST preserve denial provenance across executor, tool-result normalization, model context, planner, and alternate tool adapters.
- A denied operation MUST have an operation fingerprint containing action class, target, side-effect level, trust zone, and required privilege.
- An active denial MUST block semantically equivalent or stronger operations on alternate execution surfaces unless explicit approval covers that specific trust zone.
- A tool adapter MUST NOT translate `denied_by_policy` into `success`, generic failure, or retryable transport error.
- Approval for one execution surface MUST NOT automatically authorize another surface with a broader trust boundary.
- Denial records MUST NOT contain raw secrets, access tokens, or confidential payload bodies.
- Agents MUST NOT treat tool substitution, remote execution, shell indirection, or MCP invocation as a valid workaround for a policy denial.
- High-risk overrides MUST require explicit human approval and MUST record approver provenance, scope, and expiry.
- Policy failures MUST fail closed. A missing or malformed denial ledger MUST block privileged fallback rather than permit it.
- Security verification SHOULD include at least one local-to-remote, local-to-MCP, and equivalent-command bypass fixture when those surfaces exist.
