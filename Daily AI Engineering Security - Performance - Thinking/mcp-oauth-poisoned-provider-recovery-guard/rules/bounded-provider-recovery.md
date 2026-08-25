# Rules — Bounded Provider Recovery

1. Performance changes **MUST** capture a reconnect baseline before optimization.
2. Transport retry **MUST** be bounded by `max_transport_retries`.
3. Provider recreation **MUST** be bounded by `max_provider_recreations`.
4. Explicit OAuth lock/auth-flow corruption signatures **MUST** trigger provider-state re-evaluation rather than transport-only retry.
5. A recreated provider **MUST** have a new observable generation/identity before the next retry is counted as provider recovery.
6. A server that exhausts recovery budgets **MUST** open a circuit or otherwise stop autonomous retries.
7. One MCP server's recovery **MUST NOT** restart or invalidate unrelated healthy server providers unless a human explicitly chooses whole-process recovery.
8. Logs **MUST NOT** contain access tokens, refresh tokens, authorization headers, PKCE verifier values, or client secrets.
9. Backoff changes **MUST NOT** be claimed as a fix unless time-to-recovery or load metrics improve.
10. Success **MUST** reset consecutive-failure counters only for the successful server.
11. Unknown errors **SHOULD** remain unknown until evidence supports a provider-poison classification.
12. Improvement **MUST** be verified with before/after metrics and regression tests.
