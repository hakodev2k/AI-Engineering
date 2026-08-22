# Rules: MCP Cancellation Terminal-State Contract

1. Every MCP request **MUST** have a correlation ID, start timestamp, tool identity, session identity, and side-effect classification.
2. A cancellation notification **MUST NOT** be treated as proof that the original request is terminal.
3. Every request **MUST** end as `completed`, `cancelled`, `failed`, or explicitly `unknown` within a bounded lifecycle.
4. Clients **MUST** distinguish user cancellation, idle timeout, absolute deadline, transport loss, and server error in their local reason taxonomy even if an SDK collapses them into one exception type.
5. Idle timeout and absolute timeout **MUST** be represented separately when progress can extend request lifetime.
6. A cancellation grace period **MUST** be finite.
7. When the grace period expires without terminal evidence, the request **MUST** become `unknown`; it **MUST NOT** remain silently pending forever.
8. Side-effecting requests with `unknown` outcome **MUST NOT** be retried automatically unless the remote operation has an idempotency key or authoritative status reconciliation proves retry safety.
9. Read-only unknown requests **MAY** be retried only within a configured bounded retry count.
10. Retry attempts **MUST** retain lineage to the original request and cancellation reason.
11. A shared MCP server/session **MUST NOT** be killed as the first recovery action when request-level reconciliation is possible.
12. If one request causes later calls on the same session to wedge, the session **SHOULD** be quarantined and re-established after state/evidence is preserved.
13. Progress notifications **SHOULD** refresh idle timeout but **MUST NOT** extend an absolute maximum lifetime indefinitely.
14. Timeouts **MUST NOT** be disabled merely to accommodate a slow tool; tune measured idle/absolute limits instead.
15. Recovery loops **MUST** be bounded by `max_reconcile_attempts`.
16. Logs **MUST** record state transitions and reason codes without exposing secrets or sensitive tool payloads.
17. `Implemented` means lifecycle tracking exists; `Measured` means stuck/cancel metrics are collected; `Verified` requires deterministic terminal/unknown and retry-safety tests.
