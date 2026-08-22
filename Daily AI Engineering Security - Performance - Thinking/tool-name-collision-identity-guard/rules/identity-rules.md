# Tool Identity Rules

- Hosts **MUST** treat a public tool name as a label, not as the sole runtime identity.
- Every exposed tool **MUST** have a canonical identity derived from stable server-instance identity, namespace, and original tool name.
- Model-visible tool names **MUST** be unique for the effective tool set before a model request is sent.
- Unresolved collisions **MUST** block the request; warning-only handling **MUST NOT** be used in production enforcement mode.
- Approval, tracing, dispatch, and audit records **MUST** reference the same canonical identity.
- A dynamic tool refresh **MUST** invalidate and rebuild the identity map before refreshed tools become callable.
- A server display name **MUST NOT** be assumed globally unique.
- Renaming **SHOULD** be deterministic and stable across equivalent refreshes to preserve prompt-cache stability.
- The host **MUST NOT** execute a tool when the model-visible name maps to zero or more than one canonical identity.
- Any human approval **MUST** include the canonical identity and argument fingerprint presented for approval.
