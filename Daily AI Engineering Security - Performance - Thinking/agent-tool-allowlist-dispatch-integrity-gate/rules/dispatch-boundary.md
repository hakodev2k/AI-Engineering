# Rules — Dispatch Authorization Boundary

- Every executable tool or subagent dispatch **MUST** carry a principal, request identifier, capability name, and effective allowlist.
- The runtime dispatcher **MUST** verify membership in the effective allowlist immediately before execution.
- A model-visible tool list **MUST NOT** be treated as sufficient authorization.
- Global registry/resolver fallback **MUST NOT** widen request-scoped authority.
- Delegation **MUST** preserve or narrow the parent's effective authority and **MUST NOT** add capabilities.
- Alternate execution lanes **MUST** invoke the same authorization gate.
- Missing or malformed authorization context **MUST** fail closed.
- Sensitive tool approval **SHOULD** be bound to capability, principal and request scope rather than a broad session-wide grant.
- Authorization denials **MUST** be logged using identifiers and reason codes without secrets or raw credentials.
- Tests **MUST** include negative cases for a globally registered but request-hidden capability and nested delegation.
