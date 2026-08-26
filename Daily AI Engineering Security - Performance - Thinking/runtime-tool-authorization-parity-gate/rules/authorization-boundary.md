# Rules: Authorization Boundary

- The dispatcher MUST deny any tool not present in the exact request-scoped advertised set.
- The dispatcher MUST NOT fall back to a broader global resolver without reapplying request-scoped authorization.
- Authorization and dispatch MUST be bound to the same request context.
- High-risk tools MUST require explicit approval when policy requires it.
- Global tool registration MUST NOT imply per-request authorization.
- Model output MUST NOT be treated as authorization evidence.
- Authorization failures MUST fail closed.
- Security tests MUST include direct dispatch attempts for non-advertised tools.
- Logs SHOULD record request ID, tool, decision and reason without secrets.
- A framework upgrade that changes resolver behavior MUST trigger parity regression tests.
