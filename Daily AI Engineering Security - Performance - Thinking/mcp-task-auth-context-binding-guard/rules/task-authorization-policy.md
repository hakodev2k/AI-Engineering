# Rules: MCP Task Authorization

- Every protected task **MUST** be bound at creation to host-authenticated authorization context.
- The binding **MUST** include tenant/resource scope when those scopes affect access.
- Raw access tokens, refresh tokens, passwords, API keys, or session cookies **MUST NOT** be persisted as ownership bindings.
- Task IDs **MUST** have high entropy and **MUST NOT** be treated as sufficient authorization in multi-user deployments.
- `tasks/get`, `tasks/cancel`, `tasks/update`, and result retrieval **MUST** re-authorize the current caller against the stored binding.
- Missing authentication or missing binding **MUST** fail closed.
- Binding comparison **MUST** use constant-time comparison for keyed digests.
- Logs **MUST NOT** contain credentials or complete task result payloads merely for authorization auditing.
- TTL/deletion **MUST** remove the corresponding ownership binding.
- Recovery **MUST NOT** broaden access to resolve a binding failure.
- Any migration that changes ownership semantics **MUST** require explicit security review.
- Negative tests for cross-principal access **SHOULD** run in CI.